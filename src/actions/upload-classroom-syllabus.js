'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import SubjectModel from '@/models/subject.model';
import ClassroomModel from '@/models/classroom.model';
import TeacherModel from '@/models/teacher.model';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { revalidatePath } from 'next/cache';

/**
 * Server action to upload syllabus to a classroom
 * @param {FormData} formData - Form data containing PDF, subjectName, and classroomId
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function uploadClassroomSyllabus(formData) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || user.role !== 'teacher') {
      return {
        data: null,
        error: 'Unauthorized. Teacher access required.',
      };
    }

    // Find teacher record
    const teacher = await TeacherModel.findOne({ userId: user.id });
    if (!teacher) {
      return {
        data: null,
        error: 'Teacher record not found',
      };
    }

    const file = formData.get('pdf');
    const subjectName = formData.get('subjectName');
    const classroomId = formData.get('classroomId');

    if (!subjectName || subjectName.trim() === '') {
      return {
        data: null,
        error: 'Subject name is required',
      };
    }

    if (!classroomId) {
      return {
        data: null,
        error: 'Classroom ID is required',
      };
    }

    // Verify teacher owns the classroom
    const classroom = await ClassroomModel.findOne({
      _id: classroomId,
      teacher: teacher._id,
    });

    if (!classroom) {
      return {
        data: null,
        error: 'Classroom not found or you don\'t have access to it',
      };
    }

    if (!file) {
      return {
        data: null,
        error: 'No file uploaded',
      };
    }

    // Convert file to buffer and base64
    const bytes = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(bytes);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Process PDF with Gemini
    const result = await model.generateContent([
      {
        inlineData: {
          data: pdfBuffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      },
      {
        text: `Extract the syllabus from this PDF and return it in the following JSON format. Focus on identifying chapters and their topics. Be thorough and extract all content related to the syllabus.

{
  "subjectName": "string",
  "subjectDescription": "string",
  "chapters": [
    {
      "chapterName": "string",
      "topics": ["string"]
    }
  ]
}

Return ONLY valid JSON, no markdown, no code blocks, just the JSON object.`,
      },
    ]);

    const response = await result.response;
    let text = response.text().trim();

    // Clean the response - remove markdown code blocks if present
    if (text.startsWith('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    // Parse the JSON response
    const syllabusData = JSON.parse(text);

    // Process topics to ensure they are clean and properly formatted
    syllabusData.chapters = syllabusData.chapters.map((chapter) => ({
      ...chapter,
      topics: chapter.topics
        .map((topic) =>
          topic
            .trim()
            .replace(/^\d+\.\s*/, '') // Remove leading numbers
            .replace(/^[-•]\s*/, '') // Remove leading bullets
            .trim()
        )
        .filter((topic) => topic.length > 0), // Remove empty topics
    }));

    // Add the user-provided subject name
    syllabusData.subjectName = subjectName;

    // Create subject document
    const subject = new SubjectModel(syllabusData);
    await subject.save();

    // Update classroom with syllabus
    await ClassroomModel.findByIdAndUpdate(
      classroomId,
      { syllabusId: subject._id },
      { new: true }
    );

    // Revalidate classroom pages
    revalidatePath(`/teacher/classroom/${classroomId}`);

    return {
      data: {
        subject: syllabusData,
        message: 'Syllabus uploaded successfully to classroom',
      },
      error: null,
    };
  } catch (error) {
    console.error('Error processing syllabus:', error);
    return {
      data: null,
      error: 'Failed to process syllabus',
    };
  }
}


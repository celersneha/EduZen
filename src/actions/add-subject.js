'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import SubjectModel from '@/models/subject.model';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import StudentModel from '@/models/student.model';
import { revalidatePath } from 'next/cache';

/**
 * Server action to add a subject by processing a syllabus PDF
 * @param {FormData} formData - Form data containing PDF file and subject name
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function addSubject(formData) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user) {
      return {
        data: null,
        error: 'Unauthorized',
      };
    }

    const file = formData.get('pdf');
    const subjectName = formData.get('subjectName');

    if (!subjectName || subjectName.trim() === '') {
      return {
        data: null,
        error: 'Subject name is required',
      };
    }

    const studentId = user.id;

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
      `You are a syllabus analyzer. Extract the following information from this syllabus PDF:

1. Description: Extract a brief description or overview of the subject
2. Chapters and Topics: Extract all chapters and their corresponding topics

Format your response as a JSON object with this exact structure:
{
  "syllabusDescription": "description here",
  "chapters": [
    {
      "chapterName": "chapter name here",
      "topics": ["topic 1", "topic 2", "topic 3"]
    }
  ]
}

Important rules:
1. Return ONLY the JSON object, nothing else
2. Use double quotes for all strings
3. Make sure topics is always an array of strings
4. Do not include any markdown formatting or code blocks
5. Do not add any explanations or additional text
6. Ensure the JSON is valid and can be parsed directly
7. Each topic should be a clear, distinct point from the syllabus
8. Topics should be extracted in the order they appear in the syllabus
9. Remove any numbering or bullet points from the topics`,
    ]);

    const response = await result.response;
    let text = response.text().trim();

    // Clean up the response string
    text = text.replace(/^```json\s*|\s*```$/g, ''); // Remove markdown code block markers
    text = text.replace(/^["']|["']$/g, ''); // Remove surrounding quotes if any
    text = text.replace(/\\"/g, '"'); // Replace escaped quotes with regular quotes
    text = text.trim(); // Remove any extra whitespace

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

    // Update student with the new subject
    await StudentModel.findByIdAndUpdate(
      studentId,
      { $push: { subjects: subject._id } },
      { new: true }
    );

    // Revalidate relevant paths
    revalidatePath('/show-subjects');
    revalidatePath('/dashboard');

    return {
      data: syllabusData,
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


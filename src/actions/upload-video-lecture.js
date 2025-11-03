'use server';

import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import VideoLectureModel from '@/models/video-lecture.model';
import TeacherModel from '@/models/teacher.model';
import ClassroomModel from '@/models/classroom.model';
import { uploadVideoToCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

/**
 * Server action to upload a video lecture to Cloudinary
 * @param {FormData} formData - Form data containing video file and metadata
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function uploadVideoLecture(formData) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'teacher') {
      return {
        data: null,
        error: 'Unauthorized - Only teachers can upload video lectures',
      };
    }

    const file = formData.get('video');
    const title = formData.get('title');
    const description = formData.get('description') || '';
    const classroomId = formData.get('classroomId');
    const chapter = formData.get('chapter') || '';
    const topic = formData.get('topic') || '';

    // Validate required fields
    if (!file || !title || !classroomId) {
      return {
        data: null,
        error: 'Video file, title, and classroom ID are required',
      };
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return {
        data: null,
        error: 'Invalid file type. Only video files are allowed.',
      };
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      return {
        data: null,
        error: 'File size exceeds 500MB limit',
      };
    }

    // Verify teacher owns the classroom
    const teacher = await TeacherModel.findOne({ userId: session.user.id });
    if (!teacher) {
      return {
        data: null,
        error: 'Teacher record not found',
      };
    }

    const classroom = await ClassroomModel.findOne({
      _id: classroomId,
      teacher: teacher._id,
    });

    if (!classroom) {
      return {
        data: null,
        error: 'Classroom not found or access denied',
      };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedTitle = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const fileExtension = file.name.split('.').pop();
    const fileName = `${sanitizedTitle}-${timestamp}.${fileExtension}`;

    // Upload to Cloudinary
    const folder = `eduzen/classrooms/${classroomId}/videos`;
    const uploadResult = await uploadVideoToCloudinary(
      fileBuffer,
      folder,
      fileName
    );

    // Save to database
    const videoLecture = new VideoLectureModel({
      classroom: classroomId,
      teacher: teacher._id,
      title: title.trim(),
      description: description.trim(),
      cloudinaryPublicId: uploadResult.publicId,
      cloudinaryUrl: uploadResult.url,
      duration: uploadResult.duration,
      fileSize: uploadResult.bytes,
      chapter: chapter.trim(),
      topic: topic.trim(),
      thumbnailUrl: uploadResult.thumbnailUrl,
    });

    await videoLecture.save();

    // Revalidate classroom pages
    revalidatePath(`/teacher/classroom/${classroomId}`);
    revalidatePath(`/student/classroom/${classroomId}`);

    return {
      data: {
        id: videoLecture._id.toString(),
        title: videoLecture.title,
        description: videoLecture.description,
        url: videoLecture.cloudinaryUrl,
        thumbnailUrl: videoLecture.thumbnailUrl,
        duration: videoLecture.duration,
        chapter: videoLecture.chapter,
        topic: videoLecture.topic,
        createdAt: videoLecture.createdAt,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error uploading video lecture:', error);
    return {
      data: null,
      error: error.message || 'Failed to upload video lecture',
    };
  }
}


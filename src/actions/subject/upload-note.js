"use server";

import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import NoteModel from "@/models/note.model";
import TeacherModel from "@/models/teacher.model";
import ClassroomModel from "@/models/classroom.model";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

/**
 * Server action to upload/create a note for a specific topic
 * @param {FormData} formData - Form data containing note content, chapter, topic, and classroomId
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function uploadNote(formData) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "teacher") {
      return {
        data: null,
        error: "Unauthorized - Only teachers can upload notes",
      };
    }

    const title = formData.get("title");
    const contentValue = formData.get("content");
    // Ensure content is always a string, even if empty
    const content = contentValue ? String(contentValue).trim() : "";
    const file = formData.get("file"); // Optional file upload
    
    // Ensure content is explicitly set as a string (not null or undefined)
    const finalContent = String(content || "");
    const classroomId = formData.get("classroomId");
    const chapter = formData.get("chapter");
    const topic = formData.get("topic");

    // Validate required fields
    if (!title || !classroomId || !chapter || !topic) {
      return {
        data: null,
        error: "Title, chapter, and topic are required",
      };
    }

    // Either file or content must be provided
    if (!file && finalContent === "") {
      return {
        data: null,
        error: "Either a file or content must be provided",
      };
    }

    // Verify teacher owns the classroom
    const teacher = await TeacherModel.findOne({ userId: session.user.id });
    if (!teacher) {
      return {
        data: null,
        error: "Teacher record not found",
      };
    }

    const classroom = await ClassroomModel.findOne({
      _id: classroomId,
      teacher: teacher._id,
    });

    if (!classroom) {
      return {
        data: null,
        error: "Classroom not found or access denied",
      };
    }

    let fileUrl = null;
    let fileType = "text";

    // Handle file upload if provided
    if (file && file.size > 0) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return {
          data: null,
          error: "Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.",
        };
      }

      // Validate file size (max 10MB for documents)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          data: null,
          error: "File size exceeds 10MB limit",
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
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const fileExtension = file.name.split(".").pop();
      const fileName = `${sanitizedTitle}-${timestamp}.${fileExtension}`;

      // Upload to Cloudinary with organized folder structure
      // Structure: eduzen/classrooms/{classroomId}/notes/{chapter}/{topic}
      const sanitizedChapter = chapter
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const sanitizedTopic = topic
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const folder = `eduzen/classrooms/${classroomId}/notes/${sanitizedChapter}/${sanitizedTopic}`;
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: fileName.replace(/\.[^/.]+$/, ""),
            resource_type: "auto", // Auto-detect resource type
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });

      fileUrl = uploadResult.secure_url;
      
      // Determine file type
      if (file.type.includes("pdf")) {
        fileType = "pdf";
      } else if (file.type.includes("wordprocessingml") || file.type.includes("msword")) {
        fileType = "doc";
      } else {
        fileType = "text";
      }
    }

    // Check if note already exists for this topic
    const existingNote = await NoteModel.findOne({
      classroom: classroomId,
      chapter: chapter.trim(),
      topic: topic.trim(),
    });

    if (existingNote) {
      // Update existing note
      existingNote.title = title.trim();
      existingNote.content = finalContent; // Explicitly set as string
      if (fileUrl) {
        existingNote.fileUrl = fileUrl;
        existingNote.fileType = fileType;
      }
      await existingNote.save();

      revalidatePath(`/teacher/classroom/${classroomId}/subject`);

      return {
        data: {
          id: existingNote._id.toString(),
          title: existingNote.title,
          content: existingNote.content,
          fileUrl: existingNote.fileUrl,
          fileType: existingNote.fileType,
          chapter: existingNote.chapter,
          topic: existingNote.topic,
        },
        error: null,
      };
    }

    // Create new note - ensure content is always a string
    const noteData = {
      classroom: classroomId,
      teacher: teacher._id,
      chapter: chapter.trim(),
      topic: topic.trim(),
      title: title.trim(),
      content: finalContent, // Explicitly set as string (never null/undefined)
      fileType: fileType,
    };
    
    // Only add fileUrl if it exists
    if (fileUrl) {
      noteData.fileUrl = fileUrl;
    }
    
    const note = new NoteModel(noteData);

    await note.save();

    // Revalidate classroom pages
    revalidatePath(`/teacher/classroom/${classroomId}/subject`);

    return {
      data: {
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        fileUrl: note.fileUrl,
        fileType: note.fileType,
        chapter: note.chapter,
        topic: note.topic,
        createdAt: note.createdAt,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error uploading note:", error);
    if (error.code === 11000) {
      return {
        data: null,
        error: "A note already exists for this topic",
      };
    }
    return {
      data: null,
      error: error.message || "Failed to upload note",
    };
  }
}


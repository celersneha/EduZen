import dbConnect from "@/lib/db";
import SubjectModel from "@/models/subject.model";
import ClassroomModel from "@/models/classroom.model";

/**
 * Fetcher to get all subjects for a classroom
 * @param {string} classroomId - The classroom id
 * @returns {Promise<{data: array | null, error: string | null}>}
 */
export async function getSubjects(classroomId) {
  try {
    await dbConnect();
    if (!classroomId) {
      return {
        data: null,
        error: "Classroom ID is required",
      };
    }

    // First, get the classroom to check if it has a subject
    const classroom = await ClassroomModel.findById(classroomId).populate('subject');
    
    if (!classroom) {
      return {
        data: null,
        error: "Classroom not found",
      };
    }

    // If classroom has a subject, use it; otherwise find subjects by classroom field
    let subjects = [];
    if (classroom.subject) {
      // Classroom has a subject linked to it
      subjects = [classroom.subject];
    } else {
      // Fallback: find subjects by classroom field
      subjects = await SubjectModel.find({ classroom: classroomId });
    }

    const mappedSubjects = subjects.map((s) => {
      const chapterCount = Array.isArray(s.chapters) ? s.chapters.length : 0;
      // A subject exists means syllabus was uploaded, even if chapters array is empty
      const hasSyllabus = s && (chapterCount > 0 || s.subjectName);
      
      return {
        id: s._id?.toString(),
        subjectName: s.subjectName,
        chapterCount: chapterCount,
        hasSyllabus: hasSyllabus,
      };
    });

    return {
      data: mappedSubjects,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return {
      data: null,
      error: "Failed to fetch subjects",
    };
  }
}

import dbConnect from "@/lib/dbConnect";
import SubjectModel from "@/models/subject.model";

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
    const subjects = await SubjectModel.find({ classroom: classroomId });
    const mappedSubjects = subjects.map((s) => ({
      id: s._id?.toString(),
      subjectName: s.subjectName,
      chapterCount: Array.isArray(s.chapters) ? s.chapters.length : 0,
    }));
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

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import ClassroomModel from "@/models/classroom.model";
import SubjectModel from "@/models/subject.model";
import TeacherModel from "@/models/teacher.model";
import { getVideoLectures } from "@/fetchers/subject/get-video-lectures";
import { getNotes } from "@/fetchers/subject/get-notes";
import { ClassroomSubjectClient } from "./client";

export const metadata = {
  title: "Classroom Subject | EduZen",
  description: "View the subject and syllabus for this classroom",
};

export default async function ClassroomSubjectPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "teacher") {
    redirect("/teacher/dashboard");
  }

  const resolvedParams = await params;
  const classroomId = resolvedParams.id;

  try {
    await dbConnect();

    // Verify teacher owns the classroom
    const teacher = await TeacherModel.findOne({ userId: session.user.id });
    if (!teacher) {
      redirect("/teacher/dashboard");
    }

    const classroom = await ClassroomModel.findOne({
      _id: classroomId,
      teacher: teacher._id,
    }).populate({
      path: "subject",
      select: "subjectName subjectDescription chapters createdAt",
    });

    if (!classroom) {
      redirect("/teacher/dashboard");
    }

    // Transform subject data if it exists - ensure proper serialization
    const subjectData = classroom.subject
      ? {
          id: classroom.subject._id.toString(),
          subjectName: classroom.subject.subjectName,
          subjectDescription: classroom.subject.subjectDescription || "",
          chapterCount: Array.isArray(classroom.subject.chapters)
            ? classroom.subject.chapters.length
            : 0,
          chapters: Array.isArray(classroom.subject.chapters)
            ? classroom.subject.chapters.map((chapter) => ({
                _id: chapter._id?.toString() || null,
                chapterName: chapter.chapterName || "",
                topics: Array.isArray(chapter.topics) ? [...chapter.topics] : [],
              }))
            : [],
          createdAt: classroom.subject.createdAt,
        }
      : null;

    // Fetch video lectures and notes for this classroom
    const { data: videoLectures, error: videoLecturesError } =
      await getVideoLectures(classroomId.toString());
    const { data: notes, error: notesError } = await getNotes(
      classroomId.toString()
    );

    if (videoLecturesError) {
      console.error("Error fetching video lectures:", videoLecturesError);
    }
    if (notesError) {
      console.error("Error fetching notes:", notesError);
    }

    return (
      <ClassroomSubjectClient
        classroomId={classroomId.toString()}
        subject={subjectData}
        videoLectures={videoLectures || []}
        notes={notes || []}
        videoLecturesError={videoLecturesError}
        notesError={notesError}
      />
    );
  } catch (error) {
    console.error("Error fetching subject:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Subject
          </h2>
          <p className="text-gray-600">Failed to load subject data</p>
        </div>
      </div>
    );
  }
}


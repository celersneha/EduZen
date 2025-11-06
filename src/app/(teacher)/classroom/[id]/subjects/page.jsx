import { getClassrooms } from "@/fetchers/get-classrooms";
import { ClassroomSubjectsClient } from "./subjects-client";

export const metadata = {
  title: "Classroom Subjects | EduZen",
  description: "View all subjects in this classroom",
};

export default async function ClassroomSubjectsPage({ params }) {
  const resolvedParams = await params;
  const { data: classrooms, error } = await getClassrooms();
  if (error) {
    return <div>Error: {error}</div>;
  }
  const classroom = classrooms?.find((c) => c.id === resolvedParams.id);

  if (!classroom) {
    return <div>Classroom not found</div>;
  }
  return (
    <ClassroomSubjectsClient
      classroomId={classroom.id}
      subjects={classroom.subjects || []}
    />
  );
}

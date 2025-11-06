import { getSubjects } from "@/fetchers/get-subjects";
import { ClassroomSubjectsClient } from "./client";

export const metadata = {
  title: "Classroom Subjects | EduZen",
  description: "View all subjects in this classroom",
};

export default async function ClassroomSubjectsPage({ params }) {
  const resolvedParams = await params;
  const classroomId = resolvedParams.id;
  const { data: subjects, error } = await getSubjects(classroomId);
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <ClassroomSubjectsClient
      classroomId={classroomId}
      subjects={subjects || []}
    />
  );
}

import { getSyllabus } from "@/fetchers/get-syllabus";
import { SubjectSyllabus } from "./subject-client";

export const metadata = {
  title: "Subject Syllabus | EduZen",
  description: "View the syllabus for this subject",
};

export default async function SubjectPage({ params }) {
  const resolvedParams = await params;
  const subjectId = resolvedParams["subject-id"];
  const { data: subject, error } = await getSyllabus(subjectId);
  console.log("Fetched subject data:", subject, "with error:", error);
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  return <SubjectSyllabus subject={subject} />;
}

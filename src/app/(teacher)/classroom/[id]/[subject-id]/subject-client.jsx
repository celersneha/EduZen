import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function SubjectSyllabus({ subject }) {
  if (!subject) {
    return <div className="text-gray-500">No subject data found.</div>;
  }
  return (
    <Card
      key={subject.id || subject._id || subject.subjectCode}
      className="mb-8 bg-white/95 shadow border-0 rounded-xl"
    >
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
        <CardTitle className="text-lg font-bold">
          {subject.subjectName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {subject.chapters && subject.chapters.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {subject.chapters.map((chapter) => (
              <AccordionItem
                key={String(chapter._id)}
                value={String(chapter._id)}
                className="mb-2"
              >
                <AccordionTrigger className="font-semibold text-base bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-lg">
                  {chapter.chapterName}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="font-semibold text-gray-900 mb-2">
                    {chapter.chapterName}
                  </div>
                  {chapter.topics && chapter.topics.length > 0 ? (
                    <ul className="list-disc pl-6 mt-2">
                      {chapter.topics.map((topic, idx) => (
                        <li key={idx} className="text-gray-700 py-1">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">No topics found.</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-gray-500">No chapters found in syllabus.</div>
        )}
      </CardContent>
    </Card>
  );
}

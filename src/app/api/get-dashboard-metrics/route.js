import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubjectModel from "@/models/subject.model";
import StudentModel from "@/models/student.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const studentId = user.id;

    // Get student with populated subjects
    const student = await StudentModel.findById(studentId).populate("subjects");

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const subjects = student.subjects || [];
    const totalSubjects = subjects.length;

    // Calculate real metrics from actual data
    const totalChapters = subjects.reduce((total, subject) => {
      return total + (subject.chapters ? subject.chapters.length : 0);
    }, 0);

    const totalTopics = subjects.reduce((total, subject) => {
      return (
        total +
        (subject.chapters
          ? subject.chapters.reduce((chapterTotal, chapter) => {
              return (
                chapterTotal + (chapter.topics ? chapter.topics.length : 0)
              );
            }, 0)
          : 0)
      );
    }, 0);

    // Calculate subject performance based on content richness
    const subjectPerformanceData = subjects.map((subject) => {
      const chaptersCount = subject.chapters ? subject.chapters.length : 0;
      const topicsCount = subject.chapters
        ? subject.chapters.reduce((total, chapter) => {
            return total + (chapter.topics ? chapter.topics.length : 0);
          }, 0)
        : 0;

      // Performance based on content depth (more chapters/topics = better prepared)
      const contentScore = Math.min(
        100,
        60 + chaptersCount * 5 + topicsCount * 2
      );

      return {
        name: subject.subjectName || "Unknown Subject",
        chaptersCount,
        topicsCount,
        contentScore: Math.round(contentScore),
      };
    });

    // Study time estimation based on content
    const studyTimeData = subjects.map((subject) => {
      const chaptersCount = subject.chapters ? subject.chapters.length : 0;
      const topicsCount = subject.chapters
        ? subject.chapters.reduce((total, chapter) => {
            return total + (chapter.topics ? chapter.topics.length : 0);
          }, 0)
        : 0;

      // Estimate 2 hours per chapter + 30 minutes per topic
      const estimatedHours = chaptersCount * 2 + topicsCount * 0.5;

      return {
        subject: subject.subjectName || "Unknown Subject",
        hours: Math.round(estimatedHours),
        chapters: chaptersCount,
        topics: topicsCount,
      };
    });

    // Content mastery based on syllabus completion
    const avgTopicsPerSubject =
      totalSubjects > 0 ? totalTopics / totalSubjects : 0;
    const contentMasteryData = [
      {
        name: "Syllabus Added",
        value: totalTopics > 0 ? 100 : 0,
        fill: "#22C55E",
      },
      {
        name: "Ready to Study",
        value: totalTopics > 0 ? 100 : 0,
        fill: "#EAB308",
      },
    ];

    // Subject growth over time (based on creation dates)
    const subjectsByMonth = subjects.reduce((acc, subject) => {
      const month = new Date(subject.createdAt).toLocaleDateString("en-US", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const growthData = Object.entries(subjectsByMonth).map(
      ([month, count]) => ({
        month,
        subjects: count,
        cumulativeTopics: subjects
          .filter(
            (s) =>
              new Date(s.createdAt).getMonth() <=
              new Date(`${month} 1, 2024`).getMonth()
          )
          .reduce(
            (total, s) =>
              total +
              (s.chapters
                ? s.chapters.reduce((t, c) => t + (c.topics?.length || 0), 0)
                : 0),
            0
          ),
      })
    );

    // Calculate total estimated study hours
    const totalEstimatedHours = studyTimeData.reduce(
      (total, subject) => total + subject.hours,
      0
    );

    // Prepare simplified response data
    const dashboardMetrics = {
      keyMetrics: {
        totalSubjects: totalSubjects.toString(),
        totalChapters: totalChapters.toString(),
        totalTopics: totalTopics.toString(),
        estimatedStudyHours: `${totalEstimatedHours}hrs`,
      },
      chartData: {
        subjectPerformanceData,
        studyTimeData,
        contentMasteryData,
        growthData,
      },
      insights: {
        mostContentRichSubject:
          subjectPerformanceData.length > 0
            ? subjectPerformanceData.reduce((best, current) =>
                current.topicsCount > best.topicsCount ? current : best
              ).name
            : "No subjects yet",
        averageTopicsPerSubject: Math.round(avgTopicsPerSubject),
        totalContentItems: totalChapters + totalTopics,
        studyReadiness:
          totalTopics > 0
            ? "Ready to start studying!"
            : "Add subjects to begin",
      },
    };

    return NextResponse.json({
      success: true,
      data: dashboardMetrics,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}

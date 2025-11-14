import dbConnect from "@/lib/db";
import SubjectModel from "@/models/subject.model";
import StudentModel from "@/models/student.model";
import TestModel from "@/models/test.model";
import ClassroomModel from "@/models/classroom.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

/**
 * Fetcher to get dashboard metrics for a student
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function getDashboardMetrics() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user) {
      return {
        data: null,
        error: "Unauthorized",
      };
    }

    const userId = user.id; // This is the User ID from session

    // Get student with populated classrooms
    const student = await StudentModel.findOne({ userId: userId }).populate(
      "classrooms"
    );


    if (!student) {
      return {
        data: null,
        error: "Student not found",
      };
    }

    // Get the Student model ID (not User ID)
    const studentId = student._id;

    // Get all subjects from student's classrooms
    const classroomIds = student.classrooms?.map((c) => c._id) || [];
    
    // Method 1: Find subjects where classroom field matches
    let subjectsRaw = await SubjectModel.find({
      classroom: { $in: classroomIds },
    }).lean();
    
    // Method 2: Also check if classrooms have subject references
    const classroomsWithSubjects = await ClassroomModel.find({
      _id: { $in: classroomIds },
      subject: { $exists: true, $ne: null }
    }).select('subject').lean();
    
    const classroomSubjectIds = classroomsWithSubjects
      .map(c => c.subject?.toString())
      .filter(Boolean)
      .filter((id, index, self) => self.indexOf(id) === index); // Unique IDs only
    
    if (classroomSubjectIds.length > 0) {
      const classroomSubjectsRaw = await SubjectModel.find({
        _id: { $in: classroomSubjectIds },
      }).lean();
      
      // Merge with existing subjects, avoiding duplicates
      const existingSubjectIds = new Set(subjectsRaw.map(s => s._id.toString()));
      const uniqueClassroomSubjects = classroomSubjectsRaw.filter(s => !existingSubjectIds.has(s._id.toString()));
      subjectsRaw = [...subjectsRaw, ...uniqueClassroomSubjects];
    }
    
    // Method 3: Also fetch subjects that are referenced in tests (in case classroom field doesn't match)
    const tests = await TestModel.find({ studentId }).sort({ createdAt: 1 });
    const testSubjectIds = tests
      .map(t => t.subject?.toString())
      .filter(Boolean)
      .filter((id, index, self) => self.indexOf(id) === index); // Unique IDs only
    
    if (testSubjectIds.length > 0) {
      const testSubjectsRaw = await SubjectModel.find({
        _id: { $in: testSubjectIds },
      }).lean();
      
      // Merge with existing subjects, avoiding duplicates
      const existingSubjectIds = new Set(subjectsRaw.map(s => s._id.toString()));
      const uniqueTestSubjects = testSubjectsRaw.filter(s => !existingSubjectIds.has(s._id.toString()));
      subjectsRaw = [...subjectsRaw, ...uniqueTestSubjects];
    }
    
    // Ensure classroom field is available as string for matching
    const subjects = subjectsRaw.map((subject) => ({
      ...subject,
      _id: subject._id.toString(),
      classroom: subject.classroom?.toString() || subject.classroom,
    }));
    
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

    // Tests already fetched above for subject lookup

    // Create a mapping of all possible IDs to subjects for matching
    const idToSubjectMap = {};
    subjects.forEach((subject) => {
      const subjectId = subject._id?.toString();
      if (subjectId) {
        idToSubjectMap[subjectId] = subject;
      }
      // Also map classroom ID to subject if available
      if (subject.classroom) {
        const classroomId = subject.classroom.toString();
        idToSubjectMap[classroomId] = subject;
      }
    });

    // Calculate subject performance based on test scores
    const subjectPerformanceData = subjects.map((subject) => {
      // Match tests by Subject ID first, then fallback to classroom ID if needed
      const subjectTests = tests.filter((test) => {
        const testSubjectId = test.subject?.toString();
        if (!testSubjectId) return false;
        
        const subjectId = subject._id?.toString();
        
        // Direct match by Subject ID
        if (testSubjectId === subjectId) {
          return true;
        }
        
        // Fallback: check if test.subject matches this subject's classroom ID
        // This handles cases where tests might have been saved with classroomId
        const classroomId = subject.classroom?.toString();
        if (classroomId && testSubjectId === classroomId) {
          return true;
        }
        
        return false;
      });

      // Use testScore field (0-10 scale) and convert to percentage
      const avgScore =
        subjectTests.length > 0
          ? Math.round(
              (subjectTests.reduce(
                (sum, test) => sum + (test.testScore || 0),
                0
              ) /
                subjectTests.length) *
                10
            )
          : 0;

      const chaptersCount = subject.chapters ? subject.chapters.length : 0;
      const topicsCount = subject.chapters
        ? subject.chapters.reduce((total, chapter) => {
            return total + (chapter.topics ? chapter.topics.length : 0);
          }, 0)
        : 0;

      return {
        name: subject.subjectName || "Unknown Subject",
        chaptersCount,
        topicsCount,
        avgScore,
        testsAttempted: subjectTests.length,
      };
    });

    // Difficulty level distribution from tests
    const difficultyDistribution = tests.reduce((acc, test) => {
      const difficulty = test.difficultyLevel || "medium";
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    const difficultyData = Object.entries(difficultyDistribution).map(
      ([difficulty, count]) => ({
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        count,
        avgScore:
          tests.filter((t) => (t.difficultyLevel || "medium") === difficulty)
            .length > 0
            ? Math.round(
                (tests
                  .filter((t) => (t.difficultyLevel || "medium") === difficulty)
                  .reduce((sum, test) => sum + (test.testScore || 0), 0) /
                  tests.filter(
                    (t) => (t.difficultyLevel || "medium") === difficulty
                  ).length) *
                  10
              )
            : 0,
      })
    );

    // Score progression over time
    const scoreProgressData = tests.map((test, index) => {
      const testSubjectId = test.subject?.toString();
      
      // Try to find subject by direct ID match or by classroom ID
      const matchedSubject = subjects.find((s) => {
        return (
          s._id.toString() === testSubjectId ||
          (s.classroom && s.classroom.toString() === testSubjectId)
        );
      });
      
      return {
        testNumber: index + 1,
        score: (test.testScore || 0) * 10, // Convert 0-10 to 0-100 for display
        date: new Date(test.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        subject: matchedSubject?.subjectName || "Unknown",
        chapter: test.chapterName || "Unknown Chapter",
        topic: test.topicName || "Unknown Topic",
      };
    });

    // Content mastery based on test performance
    const avgTestScore =
      tests.length > 0
        ? Math.round(
            (tests.reduce((sum, test) => sum + (test.testScore || 0), 0) /
              tests.length) *
              10
          )
        : 0;

    // Performance distribution
    const contentMasteryData = [
      {
        name: "High Performance",
        value: tests.filter((t) => (t.testScore || 0) >= 8).length,
        fill: "#22C55E",
      },
      {
        name: "Medium Performance",
        value: tests.filter(
          (t) => (t.testScore || 0) >= 6 && (t.testScore || 0) < 8
        ).length,
        fill: "#EAB308",
      },
      {
        name: "Needs Improvement",
        value: tests.filter((t) => (t.testScore || 0) < 6).length,
        fill: "#EF4444",
      },
    ];

    // Calculate chapter-wise performance
    const chapterWisePerformance = {};
    tests.forEach((test) => {
      const key = `${test.chapterName || "Unknown"}`;
      if (!chapterWisePerformance[key]) {
        chapterWisePerformance[key] = {
          chapterName: test.chapterName || "Unknown",
          totalTests: 0,
          totalScore: 0,
          topics: new Set(),
        };
      }
      chapterWisePerformance[key].totalTests += 1;
      chapterWisePerformance[key].totalScore += test.testScore || 0;
      if (test.topicName) {
        chapterWisePerformance[key].topics.add(test.topicName);
      }
    });

    const chapterAnalysisData = Object.values(chapterWisePerformance).map(
      (chapter) => ({
        chapterName: chapter.chapterName,
        avgScore:
          chapter.totalTests > 0
            ? Math.round((chapter.totalScore / chapter.totalTests) * 10)
            : 0,
        testsAttempted: chapter.totalTests,
        topicsCovered: chapter.topics.size,
      })
    );

    // Calculate total tests
    const totalTests = tests.length;

    // Find most and least performed subjects
    const bestSubject =
      subjectPerformanceData.length > 0
        ? subjectPerformanceData.reduce((best, current) =>
            current.avgScore > best.avgScore ? current : best
          )
        : null;

    const worstSubject =
      subjectPerformanceData.length > 0
        ? subjectPerformanceData.reduce((worst, current) =>
            current.avgScore < worst.avgScore ? current : worst
          )
        : null;

    // Prepare response data
    const dashboardMetrics = {
      keyMetrics: {
        totalSubjects: totalSubjects.toString(),
        totalChapters: totalChapters.toString(),
        totalTopics: totalTopics.toString(),
        totalTests: totalTests.toString(),
        averageScore: `${avgTestScore}%`,
      },
      chartData: {
        subjectPerformanceData,
        difficultyData,
        contentMasteryData,
        scoreProgressData,
        chapterAnalysisData,
      },
      insights: {
        mostTestedSubject:
          subjectPerformanceData.length > 0
            ? subjectPerformanceData.reduce((best, current) =>
                current.testsAttempted > best.testsAttempted ? current : best
              ).name
            : "No tests yet",
        bestPerformingSubject: bestSubject ? bestSubject.name : "No tests yet",
        weakestSubject:
          worstSubject && totalTests > 0 ? worstSubject.name : "No tests yet",
        averageTopicsPerSubject: Math.round(
          totalTopics / Math.max(totalSubjects, 1)
        ),
        totalContentItems: totalChapters + totalTopics,
        testReadiness:
          totalTests > 0
            ? `${totalTests} tests completed with ${avgTestScore}% average`
            : "Take your first test to see analytics",
        difficultyPreference:
          difficultyData.length > 0
            ? difficultyData.reduce((max, current) =>
                current.count > max.count ? current : max
              ).difficulty
            : "Medium",
        recentPerformanceTrend:
          scoreProgressData.length >= 3
            ? scoreProgressData[scoreProgressData.length - 1].score >
              scoreProgressData[scoreProgressData.length - 3].score
              ? "Improving"
              : "Declining"
            : "Not enough data",
      },
    };

    return {
      data: dashboardMetrics,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      data: null,
      error: "Failed to fetch dashboard metrics",
    };
  }
}

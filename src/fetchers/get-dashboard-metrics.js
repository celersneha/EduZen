import dbConnect from '@/lib/dbConnect';
import SubjectModel from '@/models/subject.model';
import StudentModel from '@/models/student.model';
import TestModel from '@/models/test.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

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
        error: 'Unauthorized',
      };
    }

    const studentId = user.id;

    // Get student with populated subjects
    const student = await StudentModel.findById(studentId).populate('subjects');

    if (!student) {
      return {
        data: null,
        error: 'Student not found',
      };
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

    // Fetch all tests for this student
    const tests = await TestModel.find({ studentId }).sort({ createdAt: 1 });

    // Calculate subject performance based on test scores
    const subjectPerformanceData = subjects.map((subject) => {
      const subjectTests = tests.filter(
        (test) => test.subject.toString() === subject._id.toString()
      );

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
        name: subject.subjectName || 'Unknown Subject',
        chaptersCount,
        topicsCount,
        avgScore,
        testsAttempted: subjectTests.length,
      };
    });

    // Difficulty level distribution from tests
    const difficultyDistribution = tests.reduce((acc, test) => {
      const difficulty = test.difficultyLevel || 'medium';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    const difficultyData = Object.entries(difficultyDistribution).map(
      ([difficulty, count]) => ({
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        count,
        avgScore:
          tests.filter((t) => (t.difficultyLevel || 'medium') === difficulty)
            .length > 0
            ? Math.round(
                (tests
                  .filter((t) => (t.difficultyLevel || 'medium') === difficulty)
                  .reduce((sum, test) => sum + (test.testScore || 0), 0) /
                  tests.filter(
                    (t) => (t.difficultyLevel || 'medium') === difficulty
                  ).length) *
                  10
              )
            : 0,
      })
    );

    // Score progression over time
    const scoreProgressData = tests.map((test, index) => ({
      testNumber: index + 1,
      score: (test.testScore || 0) * 10, // Convert 0-10 to 0-100 for display
      date: new Date(test.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      subject:
        subjects.find((s) => s._id.toString() === test.subject.toString())
          ?.subjectName || 'Unknown',
      chapter: test.chapterName || 'Unknown Chapter',
      topic: test.topicName || 'Unknown Topic',
    }));

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
        name: 'High Performance',
        value: tests.filter((t) => (t.testScore || 0) >= 8).length,
        fill: '#22C55E',
      },
      {
        name: 'Medium Performance',
        value: tests.filter(
          (t) => (t.testScore || 0) >= 6 && (t.testScore || 0) < 8
        ).length,
        fill: '#EAB308',
      },
      {
        name: 'Needs Improvement',
        value: tests.filter((t) => (t.testScore || 0) < 6).length,
        fill: '#EF4444',
      },
    ];

    // Calculate chapter-wise performance
    const chapterWisePerformance = {};
    tests.forEach((test) => {
      const key = `${test.chapterName || 'Unknown'}`;
      if (!chapterWisePerformance[key]) {
        chapterWisePerformance[key] = {
          chapterName: test.chapterName || 'Unknown',
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
            : 'No tests yet',
        bestPerformingSubject: bestSubject ? bestSubject.name : 'No tests yet',
        weakestSubject:
          worstSubject && totalTests > 0 ? worstSubject.name : 'No tests yet',
        averageTopicsPerSubject: Math.round(
          totalTopics / Math.max(totalSubjects, 1)
        ),
        totalContentItems: totalChapters + totalTopics,
        testReadiness:
          totalTests > 0
            ? `${totalTests} tests completed with ${avgTestScore}% average`
            : 'Take your first test to see analytics',
        difficultyPreference:
          difficultyData.length > 0
            ? difficultyData.reduce((max, current) =>
                current.count > max.count ? current : max
              ).difficulty
            : 'Medium',
        recentPerformanceTrend:
          scoreProgressData.length >= 3
            ? scoreProgressData[scoreProgressData.length - 1].score >
              scoreProgressData[scoreProgressData.length - 3].score
              ? 'Improving'
              : 'Declining'
            : 'Not enough data',
      },
    };

    return {
      data: dashboardMetrics,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      data: null,
      error: 'Failed to fetch dashboard metrics',
    };
  }
}


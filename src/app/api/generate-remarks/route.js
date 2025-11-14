import { NextResponse } from "next/server";
import { getGeminiModel, cleanJsonResponse } from "@/lib/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { score, totalQuestions, topic, chapter, difficulty } = await req.json();

    if (score === undefined || !totalQuestions || !chapter) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const model = getGeminiModel('gemini-2.0-flash');

    const percentage = (score / 10) * 100;

    const prompt = `
Generate exactly 4 brief remarks about student performance. Total word limit: 40 words across all 4 points.

Test Details:
- Score: ${score}/${totalQuestions} (${percentage}%)
${topic ? `- Topic: ${topic}` : '- Scope: Entire Chapter'}
- Chapter: ${chapter}
- Difficulty: ${difficulty}

Provide 4 points covering:
1. Overall performance assessment
2. Areas of strength
3. Areas needing improvement
4. Recommendation for next steps

Each point should be 8-12 words. Return as JSON array of strings.

Format: ["point1", "point2", "point3", "point4"]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up the response
    text = cleanJsonResponse(text);

    try {
      const remarks = JSON.parse(text);
      
      if (!Array.isArray(remarks) || remarks.length !== 4) {
        throw new Error("Invalid format");
      }

      return NextResponse.json({
        success: true,
        remarks
      });

    } catch (parseError) {
      // Fallback remarks based on score
      const fallbackRemarks = getFallbackRemarks(percentage);
      return NextResponse.json({
        success: true,
        remarks: fallbackRemarks
      });
    }

  } catch (error) {
    console.error("Error generating remarks:", error);
    return NextResponse.json(
      { error: "Failed to generate remarks" },
      { status: 500 }
    );
  }
}

function getFallbackRemarks(percentage) {
  if (percentage >= 80) {
    return [
      "Excellent performance achieved",
      "Strong conceptual understanding shown",
      "Minor revision recommended",
      "Ready for advanced topics"
    ];
  } else if (percentage >= 60) {
    return [
      "Good performance overall",
      "Basic concepts well understood",
      "Some areas need attention",
      "Practice more examples"
    ];
  } else if (percentage >= 40) {
    return [
      "Average performance shown",
      "Few concepts understood",
      "Major revision needed",
      "Focus on fundamentals"
    ];
  } else {
    return [
      "Below average performance",
      "Concepts need clarity",
      "Extensive revision required",
      "Start with basics"
    ];
  }
}

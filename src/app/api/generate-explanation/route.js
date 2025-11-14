import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
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

    const { question, options, userAnswer, correctAnswer, topic } = await req.json();

    if (question === undefined || !options || userAnswer === undefined || correctAnswer === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const model = getGeminiModel('gemini-2.0-flash');

    const prompt = `
Generate a concise explanation for this quiz question. Keep it exactly 40 words.

Question: ${question}
Options: ${options.map((opt, idx) => `${idx}: ${opt}`).join(', ')}
User's Answer: ${userAnswer !== undefined ? options[userAnswer] : 'Not answered'}
Correct Answer: ${options[correctAnswer]}
${topic ? `Topic: ${topic}` : 'Context: General chapter content'}

Explain:
1. Why the correct answer is right
2. Why the user's choice was wrong (if incorrect)

Keep it educational, clear, and exactly 40 words. No extra formatting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text().trim();

    return NextResponse.json({
      success: true,
      explanation
    });

  } catch (error) {
    console.error("Error generating explanation:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

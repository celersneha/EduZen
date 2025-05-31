import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import SubjectModel from "@/models/subject.model";

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      subjectID,
      chapter,
      topic,
      difficulty,
      questionCount = 10,
    } = await req.json();

    if (!subjectID || !chapter || !topic) {
      return NextResponse.json(
        { error: "Subject ID, chapter, and topic are required" },
        { status: 400 }
      );
    }

    // Get subject details for context
    const subject = await SubjectModel.findById(subjectID);
    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Generate a quiz for the following educational content:

Subject: ${subject.subjectName}
Chapter: ${chapter}
Topic: ${topic}
Difficulty Level: ${difficulty}
Number of Questions: ${questionCount}

Please generate ${questionCount} multiple-choice questions based on the given topic. Each question should:
1. Be relevant to the topic "${topic}" from chapter "${chapter}"
2. Have 4 options (A, B, C, D)
3. Have exactly one correct answer
4. Be at ${difficulty} difficulty level
5. Test understanding, not just memorization

Format your response as a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

Important rules:
1. Return ONLY the JSON object, nothing else
2. Use double quotes for all strings
3. correctAnswer should be the index (0, 1, 2, or 3) of the correct option
4. Make sure the JSON is valid and can be parsed directly
5. Questions should be educational and appropriate
6. Avoid trick questions or ambiguous wording
7. Each question should have a clear, definitive correct answer
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up the response
    text = text.replace(/^```json\s*|\s*```$/g, "");
    text = text.replace(/^["']|["']$/g, "");
    text = text.trim();

    try {
      const quizData = JSON.parse(text);

      // Validate the quiz data
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error("Invalid quiz format");
      }

      // Validate each question
      quizData.questions.forEach((q, index) => {
        if (
          !q.question ||
          !q.options ||
          !Array.isArray(q.options) ||
          q.options.length !== 4
        ) {
          throw new Error(`Invalid question format at index ${index}`);
        }
        if (
          typeof q.correctAnswer !== "number" ||
          q.correctAnswer < 0 ||
          q.correctAnswer > 3
        ) {
          throw new Error(`Invalid correct answer at index ${index}`);
        }
      });

      return NextResponse.json({
        success: true,
        questions: quizData.questions,
        metadata: {
          subject: subject.subjectName,
          chapter,
          topic,
          difficulty,
          questionCount: quizData.questions.length,
        },
      });
    } catch (parseError) {
      console.error("Error parsing quiz JSON:", parseError);
      console.error("Raw response:", text);
      return NextResponse.json(
        { error: "Failed to generate valid quiz questions. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}

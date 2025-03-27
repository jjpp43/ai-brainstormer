import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_REQUESTS = 10;
const TIMEZONE_OFFSET = -4; // EDT offset from UTC

const getMidnightTimestamp = () => {
  const now = new Date();
  now.setUTCHours(24 + TIMEZONE_OFFSET, 0, 0, 0); // Next midnight EDT
  return now.getTime();
};

if (!GEMINI_API_KEY) {
  throw new Error("❌ Missing API_KEY in environment variables.");
}

export async function POST(req: NextRequest) {
  try {
    //Clerk - Start
    const user = await currentUser();
    const { token, userId } = await req.json();
    //Clerk - End
    const { topic, type } = await req.json();
    if (!topic) {
      console.error("No user input received.");
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    console.log("⏳ Sending request to Gemini...");
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "tunedModels/untitled-tuned-model-fntglmx5sdjo",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 500,
      },
    });

    const brainStormPrompt = `You are a brainstorming assistant. 
    Your task is to generate a detailed brainstorming tree on the given topic. 
    The tree should have a maximum depth of 4 levels, but can be shallower if the topic doesn't warrant further depth. 
    Each node should have a title and a brief description. The tree should be structured as follows:

        Root: The main topic

        Level 1: Major subtopics or categories

        Level 2: Specific aspects or ideas within each subtopic

        Level 3: Detailed points or examples

        Present the tree in a JSON format with the following structure for each node:
        {
        "id": "unique identifier",
        "title": "node title",
        "description": "brief description",
        "children": [array of child nodes]
        }
        Ensure that the IDs follow a hierarchical pattern (e.g., "1", "1-1", "1-1-1") to reflect the tree structure.

        The topic for brainstorming is: ${topic}

        Please generate a comprehensive brainstorming tree for this topic`;

    // Define the SWOT Prompt
    const swotPrompt = `You are a SWOT analysis assistant.  
    Your task is to perform a SWOT analysis for the given topic.  
    Format the response in JSON as follows:

    {
      "topic": "Topic Name",
      "swot": {
        "strengths": ["list of strengths"],
        "weaknesses": ["list of weaknesses"],
        "opportunities": ["list of opportunities"],
        "threats": ["list of threats"]
      }
    }

    The topic for SWOT analysis is: ${topic}

    Please generate a detailed SWOT analysis for this topic`;

    const prompt = type === "SWOT" ? swotPrompt : brainStormPrompt;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!response) {
      console.error("❌ Gemini returned an empty response.");
      return NextResponse.json(
        { error: "No response from AI." },
        { status: 500 }
      );
    }
    console.log("✅ Retrieved response from Gemini");
    return NextResponse.json({ ideas: text });
  } catch (error) {
    console.error("❌ API Error:, error");
    return NextResponse.json(
      { error: "Error fetching response" },
      { status: 500 }
    );
  }
}

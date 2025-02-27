import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { fetchTallyProposal, fetchSnapshotProposal, fetchForumDiscussion } from "../../lib/fetchDaoData";

export type AnalysisResponse = {
  vote: "yes" | "no";
  summary: string;
  details: string;
};

// Configure the OpenAI client to use your Gaia node.
// Set your environment variables as follows:
// - NEXT_PUBLIC_OPENAI_API_KEY: your Gaia API key
// - OPENAI_API_BASE: your Gaia node endpoint (e.g. "https://YOUR-NODE-ID.us.gaianet.network/v1")
const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE, // Ensure this URL ends with /v1
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ vote: "no", summary: "Method Not Allowed", details: "" });
  }

  const { proposalId, forumTopicId } = req.body;
  if (!proposalId) {
    return res.status(400).json({ vote: "no", summary: "Proposal ID missing", details: "" });
  }

  try {
    const [tallyData, snapshotData, forumData] = await Promise.all([
      fetchTallyProposal(proposalId),
      fetchSnapshotProposal(proposalId),
      forumTopicId ? fetchForumDiscussion(forumTopicId) : Promise.resolve(null),
    ]);

    const proposalText = `
Title: ${snapshotData.title || tallyData.title || "Untitled"}
Body: ${snapshotData.body || tallyData.body || ""}
Discussion: ${forumData ? forumData.post_stream.posts.map((p: any) => p.cooked).join("\n") : ""}
    `;

    const prompt = `
You are a governance delegate AI advisor for CollegeDAO. Evaluate the following proposal and decide if the vote should be "yes" or "no". Provide:
1. A binary vote ("yes" or "no").
2. A concise summary.
3. A detailed analysis (strengths and weaknesses).

Proposal:
${proposalText}

Respond in JSON format as:
{
  "vote": "yes",
  "summary": "Brief summary here.",
  "details": "Detailed analysis here."
}
    `;

    // Note: Adjust the model name to one available on your Gaia node.
    const response = await client.completions.create({
      model: "Meta-Llama-3-8B-Instruct-Q5_K_M",
      prompt,
      max_tokens: 300,
      temperature: 0.7,
      stop: ["\n\n"],
    });

    const outputText = response.choices[0].text?.trim();
    let analysis: AnalysisResponse;
    try {
      analysis = JSON.parse(outputText!);
    } catch (err) {
      analysis = {
        vote: "no",
        summary: "Error parsing analysis.",
        details: "The LLM output could not be parsed properly.",
      };
    }
    res.status(200).json(analysis);
  } catch (error) {
    console.error("LLM analysis error:", error);
    res.status(500).json({ vote: "no", summary: "Internal server error", details: "" });
  }
}
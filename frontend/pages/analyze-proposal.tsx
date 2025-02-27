import { useState } from "react";
import { fetchCombinedProposalData } from "../lib/fetchDaoData";
import type { AnalysisResponse } from "./api/analyzeProposal";

const AnalyzeProposal = () => {
  const [proposalId, setProposalId] = useState("");
  const [forumTopicId, setForumTopicId] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    try {
      const data = await fetchCombinedProposalData(proposalId);
      // Call the analyzeProposal API endpoint with the fetched data
      const response = await fetch("/api/analyzeProposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proposalId }),
      });
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing proposal:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Analyze Proposal</h1>
      <input
        type="text"
        placeholder="Proposal ID"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        className="mb-4 p-2 rounded border border-gray-700 bg-gray-900 text-white"
      />
      <input
        type="text"
        placeholder="Forum Topic ID (optional)"
        value={forumTopicId}
        onChange={(e) => setForumTopicId(e.target.value)}
        className="mb-4 p-2 rounded border border-gray-700 bg-gray-900 text-white"
      />
      <button
        onClick={handleAnalyze}
        className="inline-flex items-center justify-center rounded-full border border-blue-500 text-white px-5 py-3 text-base font-medium hover:bg-blue-500 hover:text-black transition"
      >
        Analyze
      </button>
      {analysis && (
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 text-left">
          <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>
          <p className="text-lg font-mono mb-4">Vote: {analysis.vote}</p>
          <p className="text-lg font-mono mb-4">Summary: {analysis.summary}</p>
          <p className="text-lg font-mono mb-4">Details: {analysis.details}</p>
        </div>
      )}
    </div>
  );
};

export default AnalyzeProposal; 
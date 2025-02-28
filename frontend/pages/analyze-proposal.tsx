import { useState } from "react";
import { fetchSnapshotProposal } from "../lib/fetchDaoData";

const AnalyzeProposal = () => {
  const [proposalId, setProposalId] = useState("");
  const [forumTopicId, setForumTopicId] = useState("");
  const [decision, setDecision] = useState<string | null>(null);
  const [logicParagraph, setLogicParagraph] = useState<string | null>(null);
  const [proofVerificationAddress, setProofVerificationAddress] = useState<string | null>(null);
  const [verifiedByOthentic, setVerifiedByOthentic] = useState<string | null>(null);
  const [verificationAddress, setVerificationAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSnapshotProposal(proposalId);
      // Call the analyzeProposal API endpoint with the fetched data
      const response = await fetch("/api/analyzeProposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proposalId }),
      });
      const result = await response.json();
      setDecision(result.decision);
      setLogicParagraph(result.logicParagraph);
      setProofVerificationAddress(result.proofVerificationAddress);
      setVerifiedByOthentic(result.verifiedByOthentic);
      setVerificationAddress(result.verificationAddress);
    } catch (error) {
      console.error("Error analyzing proposal:", error);
    } finally {
      setIsLoading(false);
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
      <p className="text-sm text-gray-400 mb-4">Suggested Proposal ID: QmWbpCtwdLzxuLKnMW4Vv4MPFd2pdPX71YBKPasfZxqLUS</p>
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
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
      {isLoading && (
        <div className="mt-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}
      {decision && !isLoading && (
        <div className={`mt-8 p-6 rounded-lg shadow-lg border text-left ${decision === 'yes' ? 'bg-green-900 border-green-700' : 'bg-red-900 border-red-700'}`}>
          <h2 className="text-lg font-semibold mb-2">Aetheris AI Decision (Powered by GAIA):</h2>
          <p className="text-lg font-mono mb-4">{decision}</p>
          <h2 className="text-lg font-semibold mb-2">Explanation:</h2>
          <p className="text-lg font-mono mb-4">{logicParagraph}</p>
          <h2 className="text-lg font-semibold mb-2">Proof Verification Address:</h2>
          <p className="text-lg font-mono mb-4">{proofVerificationAddress}</p>
          <h2 className="text-lg font-semibold mb-2">Verification Status:</h2>
          <p className="text-lg font-mono mb-4">{verifiedByOthentic}</p>
          <h2 className="text-lg font-semibold mb-2">Verification Address:</h2>
          <p className="text-lg font-mono mb-4">{verificationAddress}</p>
        </div>
      )}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnalyzeProposal; 
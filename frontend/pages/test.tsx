import { useEffect, useState } from 'react';
import { fetchTallyProposal, fetchSnapshotProposal, fetchCombinedProposalData } from '../lib/fetchDaoData';

const TestApisPage = () => {
  const [tallyResult, setTallyResult] = useState<any>(null);
  const [snapshotResult, setSnapshotResult] = useState<any>(null);
  const [combinedResult, setCombinedResult] = useState<any>(null);
  const proposalId = '27831845498978337986467036886891836384283300266814708262424272663046958396151';

  useEffect(() => {
    const testApis = async () => {
      try {
        const tally = await fetchTallyProposal(proposalId);
        setTallyResult(tally);
      } catch (error) {
        setTallyResult(`Error: ${(error as Error).message}`);
      }

      try {
        const snapshot = await fetchSnapshotProposal(proposalId);
        setSnapshotResult(snapshot);
      } catch (error) {
        setSnapshotResult(`Error: ${(error as Error).message}`);
      }

      try {
        const combined = await fetchCombinedProposalData(proposalId);
        setCombinedResult(combined);
      } catch (error) {
        setCombinedResult(`Error: ${(error as Error).message}`);
      }
    };

    testApis();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">API Test Results</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Tally Proposal Result:</h2>
        <pre className="bg-gray-900 p-4 rounded">{JSON.stringify(tallyResult, null, 2)}</pre>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Snapshot Proposal Result:</h2>
        <pre className="bg-gray-900 p-4 rounded">{JSON.stringify(snapshotResult, null, 2)}</pre>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Combined Proposal Data Result:</h2>
        <pre className="bg-gray-900 p-4 rounded">{JSON.stringify(combinedResult, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TestApisPage; 
import { useEffect, useState } from 'react';
import { testFetchSnapshotProposal} from '../lib/testApis';

const TestApisPage = () => {
  const [snapshotResult, setSnapshotResult] = useState<any>(null);
  const [combinedResult, setCombinedResult] = useState<any>(null);
  const proposalId = 'QmWbpCtwdLzxuLKnMW4Vv4MPFd2pdPX71YBKPasfZxqLUS';

  useEffect(() => {
    const testApis = async () => {
      try {
        const snapshot = await testFetchSnapshotProposal(proposalId);
        setSnapshotResult(snapshot);
      } catch (error) {
        setSnapshotResult(`Error: ${(error as Error).message}`);
      }
    };

    testApis();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">API Test Results</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Snapshot Proposal Result:</h2>
        <p className="text-xl">Title: {snapshotResult?.title || 'N/A'}</p>
        <pre className="bg-gray-900 p-4 rounded">{JSON.stringify(snapshotResult, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TestApisPage;
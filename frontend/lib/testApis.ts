import { fetchSnapshotProposal} from './fetchDaoData';

async function testFetchSnapshotProposal(proposalId: string) {
  const query = `query { proposal(id: "QmWbpCtwdLzxuLKnMW4Vv4MPFd2pdPX71YBKPasfZxqLUS") { id title body choices start end snapshot state author space { id name } } }`;
  console.log('Snapshot Proposal Query:', query);
  try {
    const result = await fetchSnapshotProposal(proposalId);
    console.log('Snapshot Proposal:', result);
    return result;
  } catch (error) {
    console.error('Error fetching Snapshot proposal:', error);
    throw error;
  }
}

async function testAllApis(proposalId: string) {
  console.log(`Testing APIs with Proposal ID: ${proposalId}`);
  await testFetchSnapshotProposal(proposalId);
}

// Execute the test with the provided testnet proposal ID
testAllApis('QmWbpCtwdLzxuLKnMW4Vv4MPFd2pdPX71YBKPasfZxqLUS');

// Example usage:
// Replace 'your-proposal-id' with a valid proposal ID to test the functions
// testFetchSnapshotProposal('your-proposal-id');
// testFetchCombinedProposalData('your-proposal-id');

export { testFetchSnapshotProposal}; 
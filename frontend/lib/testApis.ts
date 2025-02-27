import { fetchTallyProposal, fetchSnapshotProposal, fetchCombinedProposalData } from './fetchDaoData';

async function testFetchTallyProposal(proposalId: string) {
  try {
    const result = await fetchTallyProposal(proposalId);
    console.log('Tally Proposal:', result);
  } catch (error) {
    console.error('Error fetching Tally proposal:', error);
  }
}

async function testFetchSnapshotProposal(proposalId: string) {
  try {
    const result = await fetchSnapshotProposal(proposalId);
    console.log('Snapshot Proposal:', result);
  } catch (error) {
    console.error('Error fetching Snapshot proposal:', error);
  }
}

async function testFetchCombinedProposalData(proposalId: string) {
  try {
    const result = await fetchCombinedProposalData(proposalId);
    console.log('Combined Proposal Data:', result);
  } catch (error) {
    console.error('Error fetching combined proposal data:', error);
  }
}

async function testAllApis(proposalId: string) {
  console.log(`Testing APIs with Proposal ID: ${proposalId}`);
  await testFetchTallyProposal(proposalId);
  await testFetchSnapshotProposal(proposalId);
  await testFetchCombinedProposalData(proposalId);
}

// Execute the test with the provided testnet proposal ID
testAllApis('45945635894613101246140186052337442143818034660486724806334406066901491868158');

// Example usage:
// Replace 'your-proposal-id' with a valid proposal ID to test the functions
// testFetchTallyProposal('your-proposal-id');
// testFetchSnapshotProposal('your-proposal-id');
// testFetchCombinedProposalData('your-proposal-id');

export { testFetchTallyProposal, testFetchSnapshotProposal, testFetchCombinedProposalData }; 
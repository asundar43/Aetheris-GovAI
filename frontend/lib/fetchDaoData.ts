import axios from "axios";

type ForumPost = {
  cooked: string;
};

export async function fetchTallyProposal(proposalId: string) {
  const query = `
    query ($input: ProposalInput!) {
      proposal(input: $input) {
        id
        title
        body
        creator {
          address
        }
        status
      }
    }
  `;
  const variables = { input: { id: proposalId } };
  const response = await axios.post(
    "https://api.tally.xyz/query",
    { query, variables },
    { headers: { "Api-Key": process.env.NEXT_PUBLIC_TALLY_API_KEY } }
  );
  return response.data.data.proposal;
}

export async function fetchSnapshotProposal(proposalId: string) {
    const query = `
      query ($proposalId: String!) {
        proposal(id: $proposalId) {
          id
          title
          body
          choices
          state
          votes { id, voter, choice }
        }
      }
    `;
    const variables = { proposalId };
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SNAPSHOT_ENDPOINT!,
      { query, variables }
    );
    return response.data.data.proposal;
  }

export async function fetchForumDiscussion(topicId: string) {
    const response = await axios.get(`https://forum.collegedao.org/t/${topicId}.json`);
    return response.data;
  }

export async function fetchCombinedProposalData(proposalId: string) {
  const [tallyData, snapshotData] = await Promise.all([
    fetchTallyProposal(proposalId),
    fetchSnapshotProposal(proposalId)
  ]);

  const proposalText = `
    Title: ${snapshotData.title || tallyData.title || "Untitled"}
    Body: ${snapshotData.body || tallyData.body || ""}
  `;

  return {
    title: snapshotData.title || tallyData.title || "Untitled",
    body: snapshotData.body || tallyData.body || "",
    proposalText
  };
}


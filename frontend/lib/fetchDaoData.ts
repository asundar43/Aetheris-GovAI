import axios from "axios";

type ForumPost = {
  cooked: string;
};

export async function fetchSnapshotProposal(proposalId: string) {
    const query = `
      query ($proposalId: String!) {
        proposal(id: $proposalId) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
          space {
            id
            name
          }
        }
      }
    `;
    const variables = { proposalId };
    try {
      const response = await axios.post(
        'https://hub.snapshot.org/graphql',
        { query, variables }
      );
      console.log('Snapshot API Response:', response.data);
      return response.data.data.proposal;
    } catch (error) {
      console.error('Error fetching Snapshot proposal:', error);
      throw error;
    }
  }

export async function fetchForumDiscussion(topicId: string) {
    const response = await axios.get(`https://forum.collegedao.org/t/${topicId}.json`);
    return response.data;
  }


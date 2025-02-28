import { NextApiRequest, NextApiResponse } from 'next';
import { fetchSnapshotProposal } from '../../lib/fetchDaoData';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { proposalId } = req.body;
    try {
      // Fetch proposal data
      const proposal = await fetchSnapshotProposal(proposalId);
      const { title, body } = proposal;

      // Call the Gaianet API
      const gaianetResponse = await axios.post(`${process.env.OPENAI_API_BASE}/chat/completions`, {
        messages: [
          { role: "system", content: "You are a DAO advisor. Provide a concise analysis." },
          { role: "user", content: `Evaluate the following proposal and provide a yes or no decision with a brief explanation:
Title: ${title}
Body: ${body}` }
        ],
        max_tokens: 150,
        temperature: 0.5
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use API key from environment
          'Content-Type': 'application/json'
        }
      });

      // Log the API response
      console.log('Gaianet API Response:', gaianetResponse.data);

      // Extract the decision from the response
      const decisionText = gaianetResponse.data.choices && gaianetResponse.data.choices[0] && gaianetResponse.data.choices[0].message ? gaianetResponse.data.choices[0].message.content.trim() : 'No decision available';

      // Use the entire response as the logic paragraph
      const logicParagraph = decisionText;

      // Determine a simple 'yes' or 'no' based on the decision text
      const decision = decisionText.toLowerCase().includes('yes') ? 'yes' : 'no';

      // Convert decision to string format for zk proof
      const decisionString = decision === 'yes' ? 'yes' : 'no';

      // Execute task with Othentic
      const othenticResponse = await axios.post('http://localhost:4003/task/execute');
      const verifiedByOthentic = othenticResponse.status === 200 ? 'Verified by Othentic' : 'Verification failed';
      const verificationAddress = othenticResponse.data.verificationAddress || 'No address available';

      // Send the decision, verification status, and verification address back to the client
      res.status(200).json({ decisionText, logicParagraph, decision, verifiedByOthentic, verificationAddress });
    } catch (error) {
      console.error('Error analyzing proposal:', error);
      res.status(500).json({ error: 'Failed to analyze proposal' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

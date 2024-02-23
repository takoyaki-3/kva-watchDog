import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import axios from 'axios';

const API_ENDPOINT = process.env.API_ENDPOINT;
const WATCH_DOG_KEY = process.env.WATCH_DOG_KEY;
const API_SECRET = process.env.API_SECRET;
const topicArn = process.env.TOPIC_ARN;

// Create an instance of the SNS client
const snsClient = new SNSClient({ region: "ap-northeast-1" });

export const handler = async (event) => {
  try {

    // Get
    console.log(`${API_ENDPOINT}/?key=${WATCH_DOG_KEY}`)
    const items = await axios.get(`${API_ENDPOINT}/?key=${WATCH_DOG_KEY}`, {
      headers: {
        SecretToken: `${API_SECRET}`
      }
    });

    // Check created time last 5 minutes
    const now = new Date();
  
    for (let item of items.data) {
      console.log({ item });
      const created = new Date(item.created);
      const diff = now - created;
      console.log({ diff });
      if (diff >= 5 * 60 * 1000) {
        const data = JSON.parse(item.data);
        if (data.status) {
          continue;
        }

        console.log('send message');
        const params = {
          Message: `Service [${data.name}] is not working.`,
          Subject: "Watch Dog Alert!",
          TopicArn: topicArn,
        };
        const command = new PublishCommand(params);
        const res = await snsClient.send(command);
        
        console.log('sended', { res });

        const resp = await axios.post(`${API_ENDPOINT}`, {
          data: JSON.stringify({
            status: 'already sent error message',
            name: data.name,
          }),
          key: WATCH_DOG_KEY,
          id: item.id,
        }, {
          headers: {
            SecretToken: `${API_SECRET}`
          }
        });
      }
    }

    return { statusCode: 200, body: "success" };
  } catch (error) {
    console.error("ERROR:", error);
    return { statusCode: 500, body: "error" };
  }
};

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export const handler = async (event) => {
  // Get the ARN of the SNS topic from the environment variables
  const topicArn = process.env.TOPIC_ARN;

  // Create an instance of the SNS client
  const snsClient = new SNSClient({ region: "ap-northeast-1" });

  // Send a message to the SNS topic
  try {
    const params = {
      Message: "This is a test message from the Lambda function",
      Subject: "Test message from Lambda function",
      TopicArn: topicArn,
    };

    const command = new PublishCommand(params);
    const response = await snsClient.send(command);
    return { statusCode: 200, body: "success" };
  } catch (error) {
    console.error("ERROR:", error);
    return { statusCode: 500, body: "error" };
  }
};

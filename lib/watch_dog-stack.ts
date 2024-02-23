import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class WatchDogStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an SNS topic
    const topic = new sns.Topic(this, 'WatchDogTopic', {
      displayName: 'Watch Dog Alert Topic'
    });

    // Create a Lambda function
    const handler = new lambda.Function(this, 'WatchDogHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        TOPIC_ARN: topic.topicArn,
      }
    });

    // Grant the Lambda function permission to publish to the topic
    topic.grantPublish(handler);
  }
}

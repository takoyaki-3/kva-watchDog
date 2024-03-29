import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

interface WatchDogStackProps extends cdk.StackProps {
  readonly topicName: string;
  apiEndpoint: string;
  watchDogKey: string;
  apiSecret: string;
}

export class WatchDogStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WatchDogStackProps) {
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
      functionName: 'WatchDogPoller',
      environment: {
        TOPIC_ARN: topic.topicArn,
        API_ENDPOINT: props?.apiEndpoint || 'API_ENDPOINT',
        WATCH_DOG_KEY: props?.watchDogKey || 'WATCH_DOG_KEY',
        API_SECRET: props?.apiSecret || 'API_SECRET',
      }
    });

    // Grant the Lambda function permission to publish to the topic
    topic.grantPublish(handler);

    // Create a CloudWatch Events rule
    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(3)),
    });

    // Set the Lambda function as the target of the rule
    rule.addTarget(new targets.LambdaFunction(handler));
  }
}

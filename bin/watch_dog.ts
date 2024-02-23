#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WatchDogStack } from '../lib/watch_dog-stack';

require('dotenv').config();

// Get the environment variables
const apiEndpoint = process.env.API_ENDPOINT;
const watchDogKey = process.env.WATCH_DOG_KEY;
const apiSecret = process.env.API_SECRET;

const app = new cdk.App();
new WatchDogStack(app, 'WatchDogStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  topicName: 'WatchDogTopic',
  apiEndpoint: apiEndpoint || 'API_ENDPOINT',
  watchDogKey: watchDogKey || 'WATCH_DOG_KEY',
  apiSecret: apiSecret || 'API_SECRET',  
});
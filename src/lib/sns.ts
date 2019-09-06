import SNS from 'aws-sdk/clients/sns';
import AWSXRay from 'aws-xray-sdk';

interface IPublishMessage {
  [key: string]: any;
}

const snsClient = AWSXRay.captureAWSClient(new SNS());

export const sns = {
  publish: async (topicArn: string, message: IPublishMessage) => {
    return snsClient.publish({
      Message: JSON.stringify(message),
      TopicArn: topicArn,
    }).promise();
  },
};

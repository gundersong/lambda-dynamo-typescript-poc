import SNS from 'aws-sdk/clients/sns';

interface IPublishMessage {
  [key: string]: any;
}

const snsClient = new SNS();

export const sns = {
  publish: async (topicArn: string, message: IPublishMessage) => {
    return snsClient.publish({
      Message: JSON.stringify(message),
      TopicArn: topicArn,
    }).promise();
  },
};

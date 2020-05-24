import EventBridge from 'aws-sdk/clients/eventbridge';

interface ISendEvent {
  data: {
    id: string;
  };
  type: string;
}

const eventbridgeClient = new EventBridge();

export const eventbridge = {
  sendEvent: async (params: ISendEvent) => {
    const { type, data } = params;

    const events = [
      {
        metadata: {
          entity: process.env.API_ENTITY,
          type,
        },
        data,
      },
    ];
    console.log('\n'.repeat(5), process.env.EVENT_BUS_NAME, '\n'.repeat(5));
    return eventbridgeClient
      .putEvents({
        Entries: events.map(event => ({
          Detail: JSON.stringify(event),
          DetailType: process.env.API_ENTITY,
          EventBusName: process.env.EVENT_BUS_NAME,
          Source: process.env.SERVICE_NAME,
        })),
      })
      .promise();
  },
};

export const inputSchema = {
  properties: {
    body: {
      description: 'A Todo object describing a task to be done',
      properties: {
        complete: {
          description: 'A boolean indicating whether the Todo has been completed or not',
          type: 'boolean',
        },
        description: {
          description: 'The description of the Todo entry',
          type: 'string',
        },
      },
      required: ['description', 'complete'],
      type: 'object',
    }
  },
  type: 'object',
};

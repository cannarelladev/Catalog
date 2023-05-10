export type Message = {
  type: number;
  body: MessageBody;
};

export type MessageBody = {
  // Event - Meaning
  // 1 - Register/Unregister/Unsubscribe
  // 2 - Message
  // 3 - Error
  event: number;
  data: string;
};

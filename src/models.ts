

interface Message
{
  name:    string;
  message: string;
}

class UserMessage implements Message
{
  private data: { name: string; message: string; };

  constructor(payload: string)
  {
    let data = JSON.parse(payload);

    if (!data.name || !data.message)
    {
      throw new Error(`Invalid message payload received: ${payload}`);
    }

    this.data = data;
  }

  get name() : string
  {
    return this.data.name;
  }

  get message() : string
  {
    return this.data.message;
  }
}


export { UserMessage }

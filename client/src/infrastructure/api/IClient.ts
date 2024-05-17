type Destination = string;

type Message = object;

interface IClient {
  send(destination: Destination, message?: Message): Promise<void>;
}

export { Destination, Message };
export default IClient;

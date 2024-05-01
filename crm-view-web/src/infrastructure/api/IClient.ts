import Destination from '@api/Destination';
import Message from '@api/Message';

interface IClient {
  send(destination: Destination, message?: Message): Promise<void>;
}

export default IClient;

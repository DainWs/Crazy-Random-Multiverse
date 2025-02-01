import GameError from "@/domain/models/GameError";
import IErrorViewer from "@/view/IErrorViewer";
import { ref } from "vue";

const errorQueue = ref(new Array<string>());

const shouldShowQueue = () => {
  return errorQueue.value.length > 0;
}

const showGameError = (gameError: GameError): void => {
  console.log(`Game error received [${gameError.code}]: ${gameError.description}`);
  errorQueue.value.push(gameError.description);
};

const showError = (error: Error): void => {
  console.log(`Error received: ${error.message}`);
  errorQueue.value.push(error.message);
}

const getReactiveErrors = () => {
  return errorQueue;
}

const publicAccess: IErrorViewer = {
  showGameError,
  showError
};

export {
  shouldShowQueue,
  getReactiveErrors
};
export default publicAccess;
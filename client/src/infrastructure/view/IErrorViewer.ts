import GameError from "@/domain/models/GameError";

interface IErrorViewer {
  showGameError(gameError: GameError): void;
  showError(error: Error): void;
}

export default IErrorViewer;

class GameError {
    public code: string;
    public description: string;
    public language: string;

    public constructor(code: string, description: string, language: string) {
        this.code = code;
        this.description = description;
        this.language = language;
    }
}

export default GameError;
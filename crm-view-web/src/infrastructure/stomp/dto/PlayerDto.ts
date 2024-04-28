type PlayerCodeDto = string;

type PlayerDto = {
    code: PlayerCodeDto,
    name: string,
    isSpectator: boolean,
    isAlive: boolean
};

export default PlayerDto;
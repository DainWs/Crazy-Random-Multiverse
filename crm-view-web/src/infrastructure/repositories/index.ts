import UserRepository from '@/domain/UserRepository';
import GameRepository from '@/domain/GameRepository';
import SettingsRepository from '@/domain/SettingsRepository';
import CreditsRepository from '@/domain/CreditsRepository';

import localSettingsRepository from './localSettingsRepository';
import memoryCreditsRepository from './memoryCreditsRepository';
import memoryGameRepository from './memoryGameRepository';
import memoryUserRepository from './memoryUserRepository';

const userRepository: UserRepository = memoryUserRepository;
const gameRepository: GameRepository = memoryGameRepository;
const settingsRepository: SettingsRepository = localSettingsRepository;
const creditsRepository: CreditsRepository = memoryCreditsRepository;

export {userRepository, gameRepository, settingsRepository, creditsRepository};

// TODO este indice para la resolución de repositorios tal vez no deba estar aqui

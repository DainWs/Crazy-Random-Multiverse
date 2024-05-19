process.env.TS_JEST_DISABLE_VER_CHECKER = true;

/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  verbose: true,
  transform: {
    '.*\.tsx?$': [ 'ts-jest', { diagnostics: false } ]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@api(.*)$': '<rootDir>/src/infrastructure/api$1',
    '^@repositories(.*)$': '<rootDir>/src/infrastructure/repositories$1',
    '^@assets(.*)$': '<rootDir>/src/infrastructure/view/assets$1',
    '^@vue-root(.*)$': '<rootDir>/src/infrastructure/view/vue$1',
    '^@vue-pages(.*)$': '<rootDir>/src/infrastructure/view/vue/pages$1',
    '^@vue-components(.*)$': [
      '<rootDir>/src/infrastructure/view/vue/components$1',
      '<rootDir>/src/infrastructure/view/vue/pages/settings/components$1',
      '<rootDir>/src/infrastructure/view/vue/pages/game/components$1'
    ],
    '^@test(.*)$': '<rootDir>/test$1'
  },
  
};

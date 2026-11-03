export interface QuizQuestionData {
  question: string;
  answers: { answer: string; isCorrect: boolean }[];
}

export interface QuizSetData {
  title: string;
  description: string;
  isPublic: boolean;
  questions?: QuizQuestionData[];
}

/**
 * Enterprise test datasets for Sets, Game Lobbies, and Explore features.
 */
export const setsData = {
  sampleSet: {
    title: 'Computer Science Fundamentals',
    description: 'Test your understanding of algorithms, data structures, and networking.',
    isPublic: true,
  } as QuizSetData,

  privateSet: {
    title: 'Internal Team Quiz - Confidential',
    description: 'Internal trivia questions for the engineering team.',
    isPublic: false,
  } as QuizSetData,

  emptyFields: {
    title: '',
    description: '',
    isPublic: false,
  },

  gameLobbies: {
    validGameId: '849201',
    nonExistentGameId: '999999',
    shortGameId: '123',
    emptyGameId: '',
  },

  validationErrors: {
    titleRequired: 'Title is required',
    descriptionRequired: 'Description is required',
    atLeastOneQuestion: 'At least one question is required',
    gameIdRequired: 'Please enter the Game ID.',
    gameIdLength: 'Game ID must be 6 characters.',
    gameNotFound: 'Game not found or in progress. Check the ID and try again.',
  },

  searchQueries: {
    matchingQuery: 'Science',
    nonExistentQuery: 'ZzZ_NonExistent_Quiz_999',
  },
} as const;

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends UserCredentials {
  confirmPassword: string;
}

/**
 * Enterprise test datasets for authentication flows.
 * Avoids hardcoded values across test specifications.
 */
export const authData = {
  validUser: {
    email: process.env.TEST_USER_EMAIL || 'qa.tester.doppler@example.com',
    password: process.env.TEST_USER_PASSWORD || 'P@ssword123!',
  },

  invalidUsers: {
    unregistered: {
      email: 'nonexistent.user.e2e@doppler-test.com',
      password: 'WrongPassword999!',
    },
    wrongPassword: {
      email: process.env.TEST_USER_EMAIL || 'qa.tester.doppler@example.com',
      password: 'IncorrectPassword!',
    },
    invalidEmailFormat: {
      email: 'not-a-valid-email',
      password: 'Password123!',
    },
    emptyEmail: {
      email: '',
      password: 'Password123!',
    },
    emptyPassword: {
      email: 'user@example.com',
      password: '',
    },
  },

  registration: {
    validNewUser: (): RegisterCredentials => {
      const timestamp = Date.now();
      return {
        email: `new.player.${timestamp}@doppler-test.com`,
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
      };
    },
    mismatchedPasswords: {
      email: `mismatch.${Date.now()}@doppler-test.com`,
      password: 'OriginalPassword123!',
      confirmPassword: 'DifferentPassword456!',
    },
    shortPassword: {
      email: `shortpass.${Date.now()}@doppler-test.com`,
      password: '123',
      confirmPassword: '123',
    },
  },

  expectedErrors: {
    emailRequired: 'Email is required.',
    passwordRequired: 'Password is required.',
    confirmPasswordRequired: 'Please confirm your password.',
    passwordsMismatch: 'Passwords do not match.',
    invalidCredentials: 'Invalid email or password. Please check your credentials and try again.',
    weakPassword: 'Password is too weak. Try using at least 6–8 characters.',
    emailAlreadyInUse: 'An account with this email already exists. Try signing in instead.',
  },
} as const;

// config/env.ts
// Reads from .env file — never hardcode values here

import * as dotenv from 'dotenv';

// Load correct .env based on TEST_ENV variable
// Run with: TEST_ENV=prod npx playwright test
const environment = process.env.TEST_ENV || 'dev';
dotenv.config({ path: `config/.env.${environment}` });

const ENV = {
  baseUrl:             process.env.BASE_URL!,
  defaultUserEmail:    process.env.DEFAULT_USER_EMAIL!,
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD!,
  defaultFullName:     process.env.DEFAULT_FULL_NAME!,
  referralCode:        process.env.REFERRAL_CODE!,
  timeout:             30_000,
  environment,         // 'dev' | 'prod'
};

// Validate required vars are present at startup
const required = ['baseUrl', 'defaultUserEmail', 'defaultUserPassword'];
required.forEach(key => {
  if (!ENV[key as keyof typeof ENV]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
});

export default ENV;
import { TranslationEnv } from './TranslationEnv';

// export const environment: TranslationEnv = {
//   production: false,
//   // api: 'https://texts.test.nqap.de/',
//   api: 'http://localhost:3019/',
//   clientId: 'trans-front',
//   accountsUri: 'http://keycloak:8080/auth/realms/dev/account/',
//   authUri: 'https://accounts.test.nqap.de/auth/',
//   realm: 'nap01',
//   clientUri: 'http://localhost:4200/translations/',
// };

export const environment: TranslationEnv = {
  production: false,
  api: '/api/',
  accountsUri: 'http://keycloak:8080/auth/realms/dev/account/',
  authUri: 'http://keycloak:8080/auth/',
  realm: 'Dev01',
  clientId: 'trans-front',
  clientUri: 'http://localhost:4200/',
};

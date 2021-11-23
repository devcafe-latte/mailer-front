import { TranslationEnv } from './TranslationEnv';

export const environment: TranslationEnv = {
  production: false,
  api: 'http://localhost:3019/api/',
  clientId: 'trans-front',
  accountsUri: 'http://keycloak:8080/auth/realms/dev/account/',
  authUri: 'http://keycloak:8080/auth/',
  realm: 'Dev01',
  clientUri: 'http://localhost/translations/',
};

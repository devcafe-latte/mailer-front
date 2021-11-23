import { TranslationEnv } from './TranslationEnv';

export const environment: TranslationEnv = {
  production: false,
  clientId: 'trans-front',
  //These values are replaced at container start by entrypoint.sh
  api: '%%API%%',
  accountsUri: '%%ACCOUNTS_URI%%',
  authUri: '%%AUTH_URI%%',
  realm: '%%REALM%%',
  clientUri: '%%CLIENT_URI%%',
};

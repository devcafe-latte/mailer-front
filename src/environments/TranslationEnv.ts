export interface TranslationEnv {
  production: false;

  /**
   * Url to this Front-end client.
   * Used for Redirect Urls
   *
   * @type {string}
   * @memberof TranslationEnv
   */
  clientUri: string;

  /**
   * Path to the Translations API
   *
   * @type {string}
   * @memberof TranslationEnv
   */
  api: string;

  /**
   * Uri of the Keycloak Accounts Page
   *
   * @type {string}
   * @memberof TranslationEnv
   */
  accountsUri: string;

  /**
   * Uri of the keycloak Auth endpoint for logging in
   *
   * @type {string}
   * @memberof TranslationEnv
   */
  authUri: string;

  /**
   * Keycloak Realm name
   *
   * @type {string}
   * @memberof TranslationEnv
   */
  realm: string;

  /**
   * Keycloak Client Id
   *
   * @type {string}
   * @memberof TranslationEnv
   */
  clientId: string;
}
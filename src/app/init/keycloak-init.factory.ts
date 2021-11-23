import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';
import { StoreService } from '../services/store.service';

const KC_TOKEN = 'token';
const KC_REFRESH_TOKEN = 'refreshToken';
const KC_ID_TOKEN = 'idToken';

export function initializeKeycloak(
  keycloak: KeycloakService,
  store: StoreService
) {
  const token = store.getItem<string>('token');
  const refreshToken = store.getItem<string>('refreshToken');

  keycloak.keycloakEvents$.subscribe((event) => {
    switch (event.type) {
      case KeycloakEventType.OnAuthSuccess:
        //We do need this one. We're not on time for the onAuthRefreshSuccess.
        // Sometimes we save the creds twice, but that's fine.
        saveToken(keycloak, store);
        break;
      case KeycloakEventType.OnAuthLogout:
        clearToken(store);
        break;
      case KeycloakEventType.OnAuthRefreshSuccess:
        saveToken(keycloak, store);
        break;
    }

    //Store the new credentials whenever they get refreshed.
    if (event.type === KeycloakEventType.OnAuthRefreshSuccess) {
      const kc = keycloak.getKeycloakInstance();
      store.setItem('token', kc.token);
      store.setItem('refreshToken', kc.refreshToken);
      store.setItem('idToken', kc.idToken);
      console.log('Refreshed credentials stored');
    }
  });

  return () =>
    keycloak.init({
      config: {
        url: environment.authUri,
        realm: environment.realm,
        clientId: environment.clientId,
      },
      initOptions: {
        checkLoginIframe: false,
        onLoad: 'check-sso',
        token: token,
        refreshToken: refreshToken,
      },
    });
}

function saveToken(keycloak: KeycloakService, store: StoreService) {
  const kc = keycloak.getKeycloakInstance();
  store.setItem(KC_TOKEN, kc.token);
  store.setItem(KC_REFRESH_TOKEN, kc.refreshToken);
  store.setItem(KC_ID_TOKEN, kc.idToken);
  console.log('Saved credentials');
}

function clearToken(store: StoreService) {
  store.removeItem(KC_TOKEN);
  store.removeItem(KC_REFRESH_TOKEN);
  store.removeItem(KC_ID_TOKEN);
  console.debug('Cleared Auth Tokens');
}

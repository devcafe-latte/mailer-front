import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export const DEFAULT_APPLICATION = 'trans-front';

export enum ROLES {
  ADMIN = 'translations-admin',
}

@Injectable({
  providedIn: 'root',
})
export class KeycloakGuard extends KeycloakAuthGuard {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: environment.clientUri + state.url,
      });
    }

    const appRoles = this.keycloak.getKeycloakInstance().tokenParsed.resource_access[DEFAULT_APPLICATION]?.roles || [];

    if (!appRoles.includes(ROLES.ADMIN)) {
      return this.router.parseUrl('/unauthorized');
    }

    return this.authenticated;
  }
}

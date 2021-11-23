import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-auth-badge',
  templateUrl: './user-auth-badge.component.html',
  styleUrls: ['./user-auth-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAuthBadgeComponent implements OnInit {
  get name() {
    const data: any = this.kc.getKeycloakInstance().idTokenParsed;
    if (!data || !data.name) return 'Anonymous';
    return data.name;
  }

  prefix = 'user-auth-badge.';
  loggedIn = false;

  accountsPage = environment.accountsUri;

  constructor(private kc: KeycloakService) {
    this.kc.keycloakEvents$.subscribe((e) => {
      console.log('Event', e);
    });
  }

  async ngOnInit() {
    this.loggedIn = await this.kc.isLoggedIn();
  }

  logout(): void {
    this.kc.logout(environment.clientUri + 'logged-out');
  }

  login() {
    this.kc.login({ redirectUri: environment.clientUri + 'projects' });
  }
}

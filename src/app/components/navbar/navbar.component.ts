import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  prefix = 'navbar.';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private kc: KeycloakService) {
    this.init();
  }

  async init() {
    // console.log(this.kc.getKeycloakInstance().tokenParsed);
    // console.log(this.kc.getKeycloakInstance().idTokenParsed);
    // console.log(this.kc.getKeycloakInstance().refreshTokenParsed);
  }

}

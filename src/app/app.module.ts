import { LayoutModule } from '@angular/cdk/layout';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PaginatorIntl } from './components/PaginatorInl';
import { TranslationNodeComponent } from './components/translation-node/translation-node.component';
import { TranslationTreeComponent } from './components/translation-tree/translation-tree.component';
import { ConfirmComponent } from './dialogs/confirm/confirm.component';
import { ImportTranslationsComponent } from './dialogs/import-translations/import-translations.component';
import { InputDialogComponent } from './dialogs/input-dialog/input-dialog.component';
import { ProjectComponent } from './dialogs/project/project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TranslationObjectComponent } from './pages/translation-object/translation-object.component';
import { LuxonPipe } from './pipes/luxon.pipe';
import { TranslationDialogComponent } from './dialogs/translation-dialog/translation-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { UserAuthBadgeComponent } from './components/user-auth-badge/user-auth-badge.component';
import { LoggedOutComponent } from './pages/logged-out/logged-out.component';
import { StoreService } from './services/store.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TranslationNodeComponent,
    TranslationTreeComponent,
    ConfirmComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    LuxonPipe,
    ProjectComponent,
    TranslationObjectComponent,
    InputDialogComponent,
    ImportTranslationsComponent,
    TranslationDialogComponent,
    UnauthorizedComponent,
    UserAuthBadgeComponent,
    LoggedOutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    HighlightModule,
    ReactiveFormsModule,
    LayoutModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    MatRippleModule,
    MatProgressBarModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatTreeModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatCardModule,
    KeycloakAngularModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorIntl },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          yaml: () => import('highlight.js/lib/languages/yaml'),
        }
      }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, StoreService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
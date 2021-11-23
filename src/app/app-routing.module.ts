import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { TranslationObjectComponent } from './pages/translation-object/translation-object.component';
import { KeycloakGuard } from './guard/keycloak.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { LoggedOutComponent } from './pages/logged-out/logged-out.component';

const routes: Routes = [
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'logged-out', component: LoggedOutComponent },
  {
    path: '',
    canActivate: [KeycloakGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/projects' },
      { path: 'projects', component: ProjectsComponent },
      { path: 'projects/:name', component: ProjectDetailsComponent },
      { path: 'projects/:name/object', component: TranslationObjectComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

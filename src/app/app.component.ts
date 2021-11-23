import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Project } from '../model/Project';
import { Settings, DateTime } from 'luxon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  testProject: Project;

  constructor(
    private translate: TranslateService,
  ) {
    //Fuck us locale and their fucking bullshit date formats.
    if (DateTime.now().locale === 'en-US') Settings.defaultLocale = 'en-GB';

    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}

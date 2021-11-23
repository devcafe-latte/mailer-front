import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTranslationsComponent } from './import-translations.component';

describe('ImportTranslationsComponent', () => {
  let component: ImportTranslationsComponent;
  let fixture: ComponentFixture<ImportTranslationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTranslationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

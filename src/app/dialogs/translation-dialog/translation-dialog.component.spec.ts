import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationDialogComponent } from './translation-dialog.component';

describe('TranslationDialogComponent', () => {
  let component: TranslationDialogComponent;
  let fixture: ComponentFixture<TranslationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

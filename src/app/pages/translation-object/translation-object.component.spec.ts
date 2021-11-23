import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationObjectComponent } from './translation-object.component';

describe('TranslationObjectComponent', () => {
  let component: TranslationObjectComponent;
  let fixture: ComponentFixture<TranslationObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslationObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

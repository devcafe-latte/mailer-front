import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationTreeComponent } from './translation-tree.component';

describe('TranslationTreeComponent', () => {
  let component: TranslationTreeComponent;
  let fixture: ComponentFixture<TranslationTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslationTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

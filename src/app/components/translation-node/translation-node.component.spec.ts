import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationNodeComponent } from './translation-node.component';

describe('TranslationNodeComponent', () => {
  let component: TranslationNodeComponent;
  let fixture: ComponentFixture<TranslationNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslationNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

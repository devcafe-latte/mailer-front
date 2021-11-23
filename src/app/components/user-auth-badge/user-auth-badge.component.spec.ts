import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthBadgeComponent } from './user-auth-badge.component';

describe('UserAuthBadgeComponent', () => {
  let component: UserAuthBadgeComponent;
  let fixture: ComponentFixture<UserAuthBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAuthBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuthBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

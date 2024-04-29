import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireResetPasswordComponent } from './require-reset-password.component';

describe('RequireResetPasswordComponent', () => {
  let component: RequireResetPasswordComponent;
  let fixture: ComponentFixture<RequireResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequireResetPasswordComponent]
    });
    fixture = TestBed.createComponent(RequireResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

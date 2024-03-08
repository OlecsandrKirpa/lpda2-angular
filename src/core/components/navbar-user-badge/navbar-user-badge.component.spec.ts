import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUserBadgeComponent } from './navbar-user-badge.component';

describe('NavbarUserBadgeComponent', () => {
  let component: NavbarUserBadgeComponent;
  let fixture: ComponentFixture<NavbarUserBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarUserBadgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarUserBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

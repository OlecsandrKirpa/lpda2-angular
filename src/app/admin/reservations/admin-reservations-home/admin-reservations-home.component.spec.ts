import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationsHomeComponent } from './admin-reservations-home.component';

describe('AdminReservationsHomeComponent', () => {
  let component: AdminReservationsHomeComponent;
  let fixture: ComponentFixture<AdminReservationsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservationsHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminReservationsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

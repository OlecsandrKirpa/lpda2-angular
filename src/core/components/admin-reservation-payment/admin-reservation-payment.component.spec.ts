import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationPaymentComponent } from './admin-reservation-payment.component';

describe('AdminReservationPaymentComponent', () => {
  let component: AdminReservationPaymentComponent;
  let fixture: ComponentFixture<AdminReservationPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReservationPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminReservationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

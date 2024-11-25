import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EipReservationStatusComponent } from './eip-reservation-status.component';

describe('EipReservationStatusComponent', () => {
  let component: EipReservationStatusComponent;
  let fixture: ComponentFixture<EipReservationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EipReservationStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EipReservationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

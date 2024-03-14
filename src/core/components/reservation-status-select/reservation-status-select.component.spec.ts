import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationStatusSelectComponent } from './reservation-status-select.component';

describe('ReservationStatusSelectComponent', () => {
  let component: ReservationStatusSelectComponent;
  let fixture: ComponentFixture<ReservationStatusSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationStatusSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationStatusSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

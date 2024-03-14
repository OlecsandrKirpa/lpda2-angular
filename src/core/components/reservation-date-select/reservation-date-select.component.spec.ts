import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDateSelectComponent } from './reservation-date-select.component';

describe('ReservationDateSelectComponent', () => {
  let component: ReservationDateSelectComponent;
  let fixture: ComponentFixture<ReservationDateSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationDateSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationDateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

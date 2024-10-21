import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreorderReservationGroupStatusComponent } from './preorder-reservation-group-status.component';

describe('PreorderReservationGroupStatusComponent', () => {
  let component: PreorderReservationGroupStatusComponent;
  let fixture: ComponentFixture<PreorderReservationGroupStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreorderReservationGroupStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreorderReservationGroupStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

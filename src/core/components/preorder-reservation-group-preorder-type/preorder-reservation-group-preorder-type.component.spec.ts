import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreorderReservationGroupPreorderTypeComponent } from './preorder-reservation-group-preorder-type.component';

describe('PreorderReservationGroupPreorderTypeComponent', () => {
  let component: PreorderReservationGroupPreorderTypeComponent;
  let fixture: ComponentFixture<PreorderReservationGroupPreorderTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreorderReservationGroupPreorderTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreorderReservationGroupPreorderTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreorderReservationGroupFormComponent } from './preorder-reservation-group-form.component';

describe('PreorderReservationGroupFormComponent', () => {
  let component: PreorderReservationGroupFormComponent;
  let fixture: ComponentFixture<PreorderReservationGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreorderReservationGroupFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreorderReservationGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

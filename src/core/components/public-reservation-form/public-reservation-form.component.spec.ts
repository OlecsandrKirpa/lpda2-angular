import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicReservationFormComponent } from './public-reservation-form.component';

describe('PublicReservationFormComponent', () => {
  let component: PublicReservationFormComponent;
  let fixture: ComponentFixture<PublicReservationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicReservationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicReservationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

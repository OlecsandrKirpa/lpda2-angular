import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCreateOrShowReservationComponent } from './public-create-or-show-reservation.component';

describe('PublicCreateOrShowReservationComponent', () => {
  let component: PublicCreateOrShowReservationComponent;
  let fixture: ComponentFixture<PublicCreateOrShowReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicCreateOrShowReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicCreateOrShowReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

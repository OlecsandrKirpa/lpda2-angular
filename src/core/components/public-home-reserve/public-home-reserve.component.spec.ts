import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHomeReserveComponent } from './public-home-reserve.component';

describe('PublicHomeReserveComponent', () => {
  let component: PublicHomeReserveComponent;
  let fixture: ComponentFixture<PublicHomeReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHomeReserveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicHomeReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

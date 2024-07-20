import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHomeLandingComponent } from './public-home-landing.component';

describe('PublicHomeLandingComponent', () => {
  let component: PublicHomeLandingComponent;
  let fixture: ComponentFixture<PublicHomeLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHomeLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicHomeLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

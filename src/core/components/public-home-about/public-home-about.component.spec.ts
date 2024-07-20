import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHomeAboutComponent } from './public-home-about.component';

describe('PublicHomeAboutComponent', () => {
  let component: PublicHomeAboutComponent;
  let fixture: ComponentFixture<PublicHomeAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHomeAboutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicHomeAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

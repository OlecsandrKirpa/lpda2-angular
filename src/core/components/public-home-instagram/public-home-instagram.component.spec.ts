import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHomeInstagramComponent } from './public-home-instagram.component';

describe('PublicHomeInstagramComponent', () => {
  let component: PublicHomeInstagramComponent;
  let fixture: ComponentFixture<PublicHomeInstagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHomeInstagramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicHomeInstagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

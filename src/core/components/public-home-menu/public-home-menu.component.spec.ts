import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHomeMenuComponent } from './public-home-menu.component';

describe('PublicHomeMenuComponent', () => {
  let component: PublicHomeMenuComponent;
  let fixture: ComponentFixture<PublicHomeMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHomeMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicHomeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

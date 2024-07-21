import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicIconComponent } from './public-icon.component';

describe('PublicIconComponent', () => {
  let component: PublicIconComponent;
  let fixture: ComponentFixture<PublicIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

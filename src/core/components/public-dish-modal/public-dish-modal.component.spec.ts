import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDishModalComponent } from './public-dish-modal.component';

describe('PublicDishModalComponent', () => {
  let component: PublicDishModalComponent;
  let fixture: ComponentFixture<PublicDishModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicDishModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicDishModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

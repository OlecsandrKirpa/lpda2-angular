import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMenuShowIngredientsComponent } from './public-menu-show-ingredients.component';

describe('PublicMenuShowIngredientsComponent', () => {
  let component: PublicMenuShowIngredientsComponent;
  let fixture: ComponentFixture<PublicMenuShowIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicMenuShowIngredientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicMenuShowIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMenuShowAllergensComponent } from './public-menu-show-allergens.component';

describe('PublicMenuShowAllergensComponent', () => {
  let component: PublicMenuShowAllergensComponent;
  let fixture: ComponentFixture<PublicMenuShowAllergensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicMenuShowAllergensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicMenuShowAllergensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

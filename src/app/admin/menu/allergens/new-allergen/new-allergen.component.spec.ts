import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAllergenComponent } from './new-allergen.component';

describe('NewAllergenComponent', () => {
  let component: NewAllergenComponent;
  let fixture: ComponentFixture<NewAllergenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAllergenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAllergenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAllergenComponent } from './edit-allergen.component';

describe('EditAllergenComponent', () => {
  let component: EditAllergenComponent;
  let fixture: ComponentFixture<EditAllergenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAllergenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAllergenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

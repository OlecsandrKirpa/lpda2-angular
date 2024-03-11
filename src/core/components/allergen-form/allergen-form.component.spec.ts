import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllergenFormComponent } from './allergen-form.component';

describe('AllergenFormComponent', () => {
  let component: AllergenFormComponent;
  let fixture: ComponentFixture<AllergenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllergenFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllergenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishReferencesComponent } from './dish-references.component';

describe('DishReferencesComponent', () => {
  let component: DishReferencesComponent;
  let fixture: ComponentFixture<DishReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishReferencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DishReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

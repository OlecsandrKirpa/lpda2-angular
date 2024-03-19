import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateCategoryComponent } from './duplicate-category.component';

describe('DuplicateCategoryComponent', () => {
  let component: DuplicateCategoryComponent;
  let fixture: ComponentFixture<DuplicateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DuplicateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

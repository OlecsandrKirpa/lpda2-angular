import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMenuCategoryStatusComponent } from './edit-menu-category-status.component';

describe('EditMenuCategoryStatusComponent', () => {
  let component: EditMenuCategoryStatusComponent;
  let fixture: ComponentFixture<EditMenuCategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMenuCategoryStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMenuCategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

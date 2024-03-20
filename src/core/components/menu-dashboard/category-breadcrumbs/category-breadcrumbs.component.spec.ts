import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBreadcrumbsComponent } from './category-breadcrumbs.component';

describe('CategoryBreadcrumbsComponent', () => {
  let component: CategoryBreadcrumbsComponent;
  let fixture: ComponentFixture<CategoryBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryBreadcrumbsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

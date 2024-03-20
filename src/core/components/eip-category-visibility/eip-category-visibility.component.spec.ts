import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EipCategoryVisibilityComponent } from './eip-category-visibility.component';

describe('EipCategoryVisibilityComponent', () => {
  let component: EipCategoryVisibilityComponent;
  let fixture: ComponentFixture<EipCategoryVisibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EipCategoryVisibilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EipCategoryVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

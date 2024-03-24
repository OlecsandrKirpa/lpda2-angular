import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCategoryStatusComponent } from './menu-category-status.component';

describe('MenuCategoryStatusComponent', () => {
  let component: MenuCategoryStatusComponent;
  let fixture: ComponentFixture<MenuCategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCategoryStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuCategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

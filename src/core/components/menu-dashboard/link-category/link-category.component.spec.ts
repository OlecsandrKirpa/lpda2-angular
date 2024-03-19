import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCategoryComponent } from './link-category.component';

describe('LinkCategoryComponent', () => {
  let component: LinkCategoryComponent;
  let fixture: ComponentFixture<LinkCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

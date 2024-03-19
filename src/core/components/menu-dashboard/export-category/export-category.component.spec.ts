import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCategoryComponent } from './export-category.component';

describe('ExportCategoryComponent', () => {
  let component: ExportCategoryComponent;
  let fixture: ComponentFixture<ExportCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

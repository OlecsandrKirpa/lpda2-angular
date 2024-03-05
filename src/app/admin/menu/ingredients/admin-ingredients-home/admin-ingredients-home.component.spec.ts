import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIngredientsHomeComponent } from './admin-ingredients-home.component';

describe('AdminIngredientsHomeComponent', () => {
  let component: AdminIngredientsHomeComponent;
  let fixture: ComponentFixture<AdminIngredientsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminIngredientsHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminIngredientsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

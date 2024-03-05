import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAllergensHomeComponent } from './admin-allergens-home.component';

describe('AdminAllergensHomeComponent', () => {
  let component: AdminAllergensHomeComponent;
  let fixture: ComponentFixture<AdminAllergensHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAllergensHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAllergensHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuHomeComponent } from './admin-menu-home.component';

describe('AdminMenuHomeComponent', () => {
  let component: AdminMenuHomeComponent;
  let fixture: ComponentFixture<AdminMenuHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMenuHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMenuHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

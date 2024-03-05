import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsHomeComponent } from './admin-settings-home.component';

describe('AdminSettingsHomeComponent', () => {
  let component: AdminSettingsHomeComponent;
  let fixture: ComponentFixture<AdminSettingsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSettingsHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSettingsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

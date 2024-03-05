import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuTagsHomeComponent } from './admin-menu-tags-home.component';

describe('AdminMenuTagsHomeComponent', () => {
  let component: AdminMenuTagsHomeComponent;
  let fixture: ComponentFixture<AdminMenuTagsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMenuTagsHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMenuTagsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMenuShowTagsComponent } from './public-menu-show-tags.component';

describe('PublicMenuShowTagsComponent', () => {
  let component: PublicMenuShowTagsComponent;
  let fixture: ComponentFixture<PublicMenuShowTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicMenuShowTagsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicMenuShowTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

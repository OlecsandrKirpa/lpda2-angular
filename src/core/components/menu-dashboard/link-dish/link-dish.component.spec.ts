import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDishComponent } from './link-dish.component';

describe('LinkDishComponent', () => {
  let component: LinkDishComponent;
  let fixture: ComponentFixture<LinkDishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkDishComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkDishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

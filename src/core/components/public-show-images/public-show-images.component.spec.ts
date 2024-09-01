import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicShowImagesComponent } from './public-show-images.component';

describe('PublicShowImagesComponent', () => {
  let component: PublicShowImagesComponent;
  let fixture: ComponentFixture<PublicShowImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicShowImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicShowImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

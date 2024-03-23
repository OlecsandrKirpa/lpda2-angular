import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyContentComponent } from './copy-content.component';

describe('CopyContentComponent', () => {
  let component: CopyContentComponent;
  let fixture: ComponentFixture<CopyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CopyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

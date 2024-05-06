import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitExpandComponent } from './submit-expand.component';

describe('SubmitExpandComponent', () => {
  let component: SubmitExpandComponent;
  let fixture: ComponentFixture<SubmitExpandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitExpandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

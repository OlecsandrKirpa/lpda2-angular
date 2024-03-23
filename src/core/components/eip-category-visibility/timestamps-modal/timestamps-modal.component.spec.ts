import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampsModalComponent } from './timestamps-modal.component';

describe('TimestampsModalComponent', () => {
  let component: TimestampsModalComponent;
  let fixture: ComponentFixture<TimestampsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimestampsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimestampsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

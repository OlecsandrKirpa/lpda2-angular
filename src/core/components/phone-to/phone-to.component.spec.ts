import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneToComponent } from './phone-to.component';

describe('PhoneToComponent', () => {
  let component: PhoneToComponent;
  let fixture: ComponentFixture<PhoneToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneToComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhoneToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTurnsPaymentv2Component } from './select-turns-paymentv2.component';

describe('SelectTurnsPaymentv2Component', () => {
  let component: SelectTurnsPaymentv2Component;
  let fixture: ComponentFixture<SelectTurnsPaymentv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTurnsPaymentv2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectTurnsPaymentv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

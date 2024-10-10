import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OtpInputComponent } from './otp-input.component';

describe('OtpInputComponent', () => {
  let component: OtpInputComponent;
  let fixture: ComponentFixture<OtpInputComponent>;
  let size: number = 6;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpInputComponent);
    component = fixture.componentInstance;
    component.size = size;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('writeValue()', () => {
    it('should set the value to empty string if the value is undefined', () => {
      component.writeValue(undefined);
      expect(component.value).toBe('');
    });

    it('should set the value to empty string if the value is null', () => {
      component.writeValue(null);
      expect(component.value).toBe('');
    });

    it('should keep only the first [size] digits', () => {
      const value = '1234567890';

      component.writeValue(value);
      expect(component.value).toBe(value.substring(0, component.size));
    });

    it('should ignore non-digit characters', () => {
      const value = '~. 12-34_56| ';
      const expectedVale = value.replace(/\D/g, '').substring(0, component.size);

      component.writeValue(value);
      expect(component.value).toBe(expectedVale);
    });
  });

  describe('@Input() size', () => {
    beforeAll(() => {
      size = 4;
    });

    it('should create the correct number of controls', () => {
      expect(component.controls.length).toBe(size);
    });

    it('should create the correct number of inputs', () => {
      expect(component.inputs?.length).toBe(size);
    });
  });

  describe('@Output() ready', () => {
    it('should emit the value when the input is complete', fakeAsync(() => {
      const spy = spyOn(component.ready, 'emit');
      let value = '';

      component.controls.forEach((control) => {
        control.setValue('1');
        value += '1';
      });
      tick();
      fixture.debugElement.nativeElement.dispatchEvent(new InputEvent('input', { data: '1' }));
      tick();

      expect(spy).toHaveBeenCalledWith(value);
      spy.calls.reset();
    }));
  });

  describe('focusInput()', () => {
    it('should focus the input at the given index', () => {
      const expectedTarget = 2;
      const spy = spyOn(component.inputs?.get(expectedTarget) as never, 'focus');

      component.value = new Array(component.size).fill('1').join('');

      component.focusInput(expectedTarget);
      expect(spy).toHaveBeenCalled();
      spy.calls.reset();
    });

    it('should focus the first input if the index is negative', () => {
      const expectedTarget = 0;
      const spy = spyOn(component.inputs?.get(expectedTarget) as never, 'focus');

      component.focusInput(-1);
      expect(spy).toHaveBeenCalled();
      spy.calls.reset();
    });

    it('should focus the last input if the index is greater than the size', () => {
      const expectedTarget = size - 1;
      const spy = spyOn(component.inputs?.get(expectedTarget) as never, 'focus');

      component.value = new Array(component.size).fill('1').join('');

      component.focusInput(size);
      expect(spy).toHaveBeenCalled();
      spy.calls.reset();
    });

    it('should focus the first input when value is blank and trying to select another input', () => {
      const expectedTarget = 0;
      const spy = spyOn(component.inputs?.get(expectedTarget) as never, 'focus');

      component.value = '';

      component.focusInput(size);
      expect(spy).toHaveBeenCalled();
      spy.calls.reset();
    });

    it('should focus the first empty input when value is not full and trying to select a greater index', () => {
      const expectedTarget = 2;
      const spy = spyOn(component.inputs?.get(expectedTarget) as never, 'focus');

      component.value = '12';

      component.focusInput(size);
      expect(spy).toHaveBeenCalled();
      spy.calls.reset();
    });
  });
});

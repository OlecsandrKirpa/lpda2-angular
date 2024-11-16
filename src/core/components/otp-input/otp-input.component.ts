import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, QueryList, ViewChildren, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InlineInputComponent } from './components/inline-input/inline-input.component';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InlineInputComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss'
})
export class OtpInputComponent implements ControlValueAccessor, OnInit {
  public value: string = '';
  public controls: FormControl[] = [];
  public focusIndex = 0;
  public isDisabled: boolean = false;

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private onChangeFn?: (value: string) => void;
  private onTouchedFn?: () => void;

  @Input() size: number = 6;
  @Input() clearTailOnChange: boolean = false;

  @Output() ready = new EventEmitter<string>();

  @ViewChildren(InlineInputComponent) inputs?: QueryList<InlineInputComponent>;

  @HostBinding('class.disabled') get disabled() {
    return this.isDisabled;
  }

  @HostBinding('style.--size') get _size() {
    return this.size;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.value = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').substring(0, this.size);
    this.refreshControlsFromValue();
    this.focusInput(this.value.length);

    this.triggerValueChange();
  }

  @HostListener('input', ['$event'])
  onKeyboardInput(event: InputEvent) {
    if(event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') return;

    // When an invalid value is inserted, we'll just ignore it and reset the previous value of the input.
    if(event.data !== null && event.inputType === 'insertText' && isNaN(parseInt(event.data))) {
      this.controls[this.focusIndex].setValue(this.value[this.focusIndex] || '');
      this.updateValue(false);
      return;
    }

    this.updateValue();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch(event.key) {
      case 'Home':
        // focus the first input
        this.focusInput(0);
        this.focusInput(0);
        break;
      case 'End':
        // focus the last input
        this.focusInput(this.size - 1);
        this.focusInput(this.size - 1);
        break;
      case 'Delete':
        // remove the value of the current input
        this.controls[this.focusIndex].setValue('');
        this.updateValue(false);
        break;
      case 'ArrowLeft':
        if(this.focusIndex > 0){
          // focus the previous input if we are not at the beginning
          this.focusInput(this.focusIndex - 1);
        } else {
          // focus the first input if we are at the beginning
          this.focusInput(0);
        }
        break;
      case 'ArrowRight':
        if(this.focusIndex < this.size - 1){
          // focus the next input if we are not at the end
          this.focusInput(this.focusIndex + 1);
        } else {
          // focus the last input if we are at the end
          this.focusInput(this.size - 1);
        }
        break;
      case 'Backspace':
        // remove value in current input and focus the previous input
        this.controls[this.focusIndex].setValue('');
        this.focusIndex = Math.max(0, this.focusIndex - 1);
        this.updateValue(false);
        break;
    }
  }

  ngOnInit() {
    for(let i = 0; i < this.size; i++) {
      this.controls.push(new FormControl());
    }

    this.changeDetectorRef.detectChanges();

    setTimeout(() => { this.focusInput(0); });
  }

  writeValue(value?: string | null): void {
    this.value = (value ?? '').replace(/\D/g, '').substring(0, this.size);
    this.refreshControlsFromValue();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;

  }
  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  focus(){
    this.focusInput(this.focusIndex);
  }

  focusInput(index: number) {
    const newIndex = Math.max(0, Math.min(index, this.size - 1, this.value.length));
    const input = this.inputs?.get(newIndex);

    if(input) {
      this.focusIndex = newIndex;
      input.focus();
    }
  }

  updateValue(focusNext:boolean = true){
    this.changeDetectorRef.detectChanges();

    const values: string[] = [];
    this.controls.forEach((control: FormControl<string>, index: number) => {
      if(control.value !== undefined && control.value !== null && (!this.clearTailOnChange || index <= this.focusIndex)){3
        values.push(control.value.toString().replace(/\D/g, ''));
      }
    });

    this.value = values.join('');
    this.value = this.value.substring(0, this.size);
    this.triggerValueChange();


    setTimeout(() => {
      this.refreshControlsFromValue(focusNext);
    });
  }

  private triggerValueChange() {
    this.onChangeFn?.(this.value);
    this.onTouchedFn?.();

    if(this.value.length === this.size){
      this.ready.emit(this.value);
    }
  }

  private refreshControlsFromValue(focusNext: boolean = true) {
    this.controls.forEach((control, index) => {
      control.setValue((this.value || [])[index] || '');
    });

    this.focusInput(this.focusIndex + (focusNext ? 1 : 0));
    this.changeDetectorRef.detectChanges();
  }
}

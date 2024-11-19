import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, Input, OnChanges, OnInit} from '@angular/core';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NgClass, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {TuiLinkModule} from "@taiga-ui/core";
import {ContactUsComponent} from "@core/components/contact-us/contact-us.component";

/**
 * TEST THIS COMPONENT WITH external component:
```html
@for(option of options; track option){
  <h1>When max {{option}}</h1>
  <app-people-count-input [maxPeople]="option" ></app-people-count-input>
  <hr class="mb-3" >
}```html

 ```ts
  readonly options: number[] = Array.from({length: 20}, (_, i) => i + 1);
 ```
 */

@Component({
  selector: 'app-people-count-input',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    TuiLinkModule,
    ContactUsComponent
  ],
  templateUrl: './people-count-input.component.html',
  styleUrl: './people-count-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PeopleCountInputComponent,
      multi: true
    }
  ]
})
export class PeopleCountInputComponent implements OnInit, OnChanges, ControlValueAccessor {
  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  readonly control: FormControl = new FormControl(null);
  @Input() maxPeople: number = 10;
  perRow: number = 2;

  ngOnInit(): void {
    this.recalculatePerRow();
    this.recalculateOptions();
  }

  ngOnChanges(): void {
    this.recalculatePerRow();
    this.recalculateOptions();
  }

  options: number[] = [];

  writeValue(obj: unknown): void {
    if (typeof obj === "string" && obj.length > 0 && obj.match(/^\d+$/)) {
      obj = Number(obj);
    }

    if (typeof obj === null || typeof obj === undefined) {
      obj = null;
    }

    if (obj === null || typeof obj === "number") {
      this.control.setValue(obj);
      this.cd.detectChanges();
      return;
    }

    console.warn(`PeopleCountInputComponent: invalid value ${obj}`);
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  private innerWidth: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: number) {
    this.innerWidth = window.innerWidth;
    this.recalculatePerRow();
  }

  private recalculatePerRow(): void {
    if (this.innerWidth < 768) {
      this.perRow = 2;
      return;
    }

    if (this.innerWidth < 992 && this.maxPeople % 3 === 0) {
      this.perRow = 3;
      return;
    }

    let divisor = 5;
    while(divisor > 2) {
      if (this.maxPeople % divisor === 0) {
        this.perRow = divisor;
        return;
      }

      divisor--;
    }

    this.perRow = divisor;
  }

  private recalculateOptions(): void {
    this.options = Array.from({length: this.maxPeople}, (_, i) => i + 1);
  }
}

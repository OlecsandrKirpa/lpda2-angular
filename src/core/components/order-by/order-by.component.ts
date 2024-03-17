import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef, Inject,
  inject,
  Input,
  OnInit, Optional,
  Output, Self
} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgIf} from "@angular/common";
import {TuiButtonModule, TuiHintModule, TuiModeDirective} from "@taiga-ui/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {
  AbstractTuiNullableControl, tuiAsControl,
  tuiAsFocusableItemAccessor,
  TuiDestroyService,
  TuiFocusableElementAccessor, TuiNativeFocusableElement, tuiPure
} from "@taiga-ui/cdk";
import {TuiRadioBlockComponent} from "@taiga-ui/kit";

export interface orderBy {
  field: string;
  asc: boolean;
}

@Component({
  selector: 'app-order-by',
  standalone: true,
  imports: [
    MatIcon,
    NgClass,
    NgIf,
    TuiButtonModule,
    TuiHintModule
  ],
  templateUrl: './order-by.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiAsFocusableItemAccessor(OrderByComponent),
    tuiAsControl(OrderByComponent),
  ],
})
export class OrderByComponent extends AbstractTuiNullableControl<{ field: string, asc: boolean }>
  implements TuiFocusableElementAccessor {

  @Input({required: true}) item?: string;

  @Input() hint?: string = $localize`Clicca per ordinare gli elementi`;

  constructor(
    @Optional()
    @Self()
    @Inject(NgControl)
      control: NgControl | null,
    @Inject(ChangeDetectorRef) cdr: ChangeDetectorRef,
    @Optional()
    @Inject(TuiModeDirective)
    readonly modeDirective: TuiModeDirective | null,
  ) {
    super(control, cdr);
  }

  trigger(): void {
    if (!(this.item)) return;

    if (!(this.value && this.value?.field === this.item)) {
      this.value = {field: this.item, asc: true};
      return;
    }

    if (this.isCurrent && !this.isAsc) {
      this.value = null;
      return;
    }

    this.value = {field: this.item, asc: !this.value?.asc};
  }

  get isAsc(): boolean {
    return this.value?.asc ?? false;
  }


  get isCurrent(): boolean {
    return this.value?.field === this.item;
  }

  // get focused(): boolean {
  //   // return !!this.radio && this.radio.focused;
  //   return false;
  // }
  focused: boolean = false;

  // get nativeFocusableElement(): TuiNativeFocusableElement | null {
  //   // return this.radio?.nativeFocusableElement ?? null;
  //   return null;
  // }
  nativeFocusableElement: TuiNativeFocusableElement | null = null;
}
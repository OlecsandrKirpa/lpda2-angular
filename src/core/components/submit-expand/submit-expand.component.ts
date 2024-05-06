import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {
  TuiButtonModule,
  TuiButtonOptions,
  TuiExpandModule,
  TuiSizeL,
  TuiSizeM,
  TuiSizeS,
  TuiSizeXL,
  TuiSizeXS
} from "@taiga-ui/core";

@Component({
  selector: 'app-submit-expand',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiExpandModule
  ],
  templateUrl: './submit-expand.component.html',
  styleUrl: './submit-expand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmitExpandComponent {
  @Input({required: true}) expanded: boolean = false;
  @Input() buttonSize: TuiSizeXS | TuiSizeS | TuiSizeM | TuiSizeL | TuiSizeXL = "m";
  @Input() cancelAppearance: TuiButtonOptions["appearance"] = "outline";

  @Output() submit: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  submitted() {
    this.submit.emit();
  }

  cancelled(): void {
    this.submit.emit();
  }
}

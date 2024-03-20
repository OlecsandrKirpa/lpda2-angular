import {ChangeDetectionStrategy, Component, EventEmitter, inject, Injector, Input, Output} from '@angular/core';
import {TuiButtonModule, TuiDialogService} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {TuiDestroyService} from "@taiga-ui/cdk";
import {takeUntil} from "rxjs";
import {
  EditNameDescModalComponent
} from "@core/components/name-desc-eip/edit-name-desc-modal/edit-name-desc-modal.component";

@Component({
  selector: 'app-name-desc-eip',
  standalone: true,
  imports: [
    TuiButtonModule,
    MatIcon
  ],
  templateUrl: './name-desc-eip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
  ]
})
export class NameDescEipComponent {
  private readonly dialogs: TuiDialogService = inject(TuiDialogService);
  private readonly injector: Injector = inject(Injector);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  @Output() submittedChanges = new EventEmitter<{
    name: Record<string, string>;
    description: Record<string, string>
  }>();

  @Input({required: true}) translations?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
  };

  showDialog(): void {
    this.dialogs.open<any>(
      new PolymorpheusComponent(EditNameDescModalComponent, this.injector),
      {
        data: this.translations,
        dismissible: false,
        label: $localize`Modifica nome o descrizione`,
      },
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) this.submittedChanges.emit(data);
      },
      error: (data: any) => {
        console.warn(`completed with error`, data)
      },
      complete: () => {
      },
    });
  }
}

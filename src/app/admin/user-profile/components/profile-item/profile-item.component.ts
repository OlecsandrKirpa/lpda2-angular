import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { PolymorpheusContent, PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

export type ProfileItemEditEvent = 'started' | 'terminated' | 'submit' | 'submitting' | 'error' | 'cancel';

@Component({
  selector: 'app-profile-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PolymorpheusModule,
    TuiButtonModule,
    TuiLoaderModule,
  ],
  templateUrl: './profile-item.component.html',
  styleUrl: './profile-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileItemComponent implements OnInit {
  @Input() icon?: string;
  @Input() label: PolymorpheusContent = '';
  @Input() editable: boolean = true;
  @Input() editIcon: PolymorpheusContent = 'edit';
  @Input() editTemplate: PolymorpheusContent = '';
  @Input() link?: string | string[];

  @Output() edit = new EventEmitter<ProfileItemComponent>();

  public editing: boolean = false;
  public submitting: boolean = false;
  public edit$ = new EventEmitter<ProfileItemEditEvent>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);


  ngOnInit() {
    this.edit$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      switch(value) {
        case 'started':
          this.editing = true;
          this.submitting = false;
          this.edit.emit(this);
          break;
        case 'terminated':
        case 'cancel':
          this.submitting = false;
          this.editing = false;
          break;
        case 'submitting':
          this.submitting = true;
          break;
        case 'error':
          this.submitting = false;
          break;
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  get labelType(): 'string' | 'template' {
    return typeof this.label === 'string' ? 'string' : 'template';
  }

  get editIconType(): 'string' | 'template' {
    return typeof this.editIcon === 'string' ? 'string' : 'template';
  }

  startEdit(): void {
    if(this.link){
      this.router.navigate([this.link], {relativeTo: this.activatedRoute});
      return;
    }

    this.edit$.next('started');
  }

  terminateEdit(): void {
    this.edit$.next('terminated');
  }
}

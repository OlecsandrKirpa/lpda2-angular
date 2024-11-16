import { Component, DestroyRef, EventEmitter, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@core/models/user';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { ProfileItemEditEvent } from '../profile-item/profile-item.component';
import { ProfileService } from '@core/services/http/profile.service';

@Component({
  selector: 'app-edit-fullname',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiAutoFocusModule,
  ],
  templateUrl: './edit-fullname.component.html',
  styleUrl: './edit-fullname.component.scss'
})
export class EditFullnameComponent implements OnInit {
  @Input() user?: User
  @Input() observable$?: EventEmitter<ProfileItemEditEvent>;

  public control: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly profile: ProfileService = inject(ProfileService);

  ngOnInit() {
    this.control.setValue(this.profile.cu()?.fullname);

    this.observable$?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if(value === 'submit'){
        this.submit();
      }
    });
  }

  submit() {
    if(this.control.invalid) return;

    this.observable$?.next('submitting');
    this.profile.update({fullname: this.control.value}).subscribe({
      next: () => {
        this.observable$?.next('terminated');
      },
      error: () => {
        this.observable$?.next('error');
      }
    });
  }
}

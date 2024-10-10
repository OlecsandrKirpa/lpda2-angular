import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { User } from '@core/models/user';
import { ProfileService } from '@core/services/http/profile.service';
import { TuiButtonModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiInputModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TuiLoaderModule,
    TuiCheckboxLabeledModule,
    ReactiveFormsModule,
    RouterModule,
    TuiButtonModule,
    CurrencyPipe,
    TuiInputModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './confirm-delete.page.html',
  styleUrl: './confirm-delete.page.scss'
})
export class ConfirmDeletePage implements OnInit {
  private readonly profile: ProfileService = inject(ProfileService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);

  public user?: User;
  public loading: boolean = false;
  public submitting: boolean = false;

  public form: FormGroup = new FormGroup({
    confirm_data_removal: new FormControl(false, [Validators.requiredTrue]),
    email: new FormControl(null, [Validators.required]),
  });

  ngOnInit() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if(this.user?.email === value.email?.toLowerCase()?.trim()) {
        this.form.get('email')?.setErrors(null);
      } else {
        this.form.get('email')?.setErrors({ notMatches: true });
      }
    });

    this.loading = true;
    this.profile.load().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user: User) => {
        this.loading = false;
        this.user = user;
        // this.form.patchValue({ confirm_waiver_of_credit: user.balance === 0 })
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  submit(): void {
    if(this.form.invalid) return;

    this.submitting = true;
    this.profile.deleteProfile().subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.submitting = false;
      }
    })
  }
}

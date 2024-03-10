import {ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TuiInputModule} from "@taiga-ui/kit";
import {TuiAutoFocusModule, TuiDestroyService} from "@taiga-ui/cdk";
import {TuiButtonModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";
import {SearchResult} from "../../../../../core/lib/search-result.model";
import {Allergen} from "../../../../../core/models/allergen";
import {AllergensService} from "../../../../../core/services/http/allergens.service";
import {finalize, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-admin-allergens-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    MatIcon,
  ],
  templateUrl: './admin-allergens-home.component.html',
  styleUrl: './admin-allergens-home.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class AdminAllergensHomeComponent {
  readonly loading: WritableSignal<boolean> = signal(false);
  private readonly data: WritableSignal<SearchResult<Allergen> | null> = signal(null);
  private readonly items: Signal<Allergen[]> = computed(() => this.data()?.items || []);
  private readonly service: AllergensService = inject(AllergensService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly form: FormGroup = new FormGroup({
    query: new FormControl(``),
    offset: new FormControl(0, [Validators.min(0), Validators.required]),
    per_page: new FormControl(10, [Validators.min(1), Validators.required]),
  });

  ngOnInit(): void {
    this.search();
  }

  formSubmit(): void {
    this.search();
  }

  private search(): void {
    this.loading.set(true);
    this.service.search(this.filters()).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading.set(false)),
      tap(() => console.log(`component tap`)),
    ).subscribe({
      next: (result: SearchResult<Allergen>) => {
        this.data.set(result);
        console.log(`component next`);
      },
      complete: () => {
        console.log(`component complete`);
      }
    });
  }

  private filters(): Record<string, string | number> {
    const filters = this.form.value;

    return filters;
  }
}

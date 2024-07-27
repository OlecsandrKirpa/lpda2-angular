import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {PublicPagesDataService} from "@core/services/http/public-pages-data.service";
import {TuiDestroyService, tuiPure} from "@taiga-ui/cdk";
import {takeUntil} from "rxjs";
import {JsonPipe, NgOptimizedImage} from "@angular/common";
import {TuiLinkModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [
    JsonPipe,
    TuiLinkModule,
    NgOptimizedImage,
    MatIcon
  ],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class PublicFooterComponent implements OnInit {
  private readonly public: PublicPagesDataService = inject(PublicPagesDataService);
  private readonly destroy$: TuiDestroyService = inject(TuiDestroyService);

  readonly contacts: WritableSignal<Record<string, string> | null> = signal(null);

  ngOnInit(): void {
    this.public.getContacts().pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (contacts: Record<string, string> | null): void => {
        this.contacts.set(contacts);
      }
    });
  }

  @tuiPure
  contact(key: string): string | null {
    console.log(`got contact`, key);

    const contacts: Record<string, string> | null = this.contacts();

    if (!contacts) return null;

    return contacts[key] ?? null;
  }

  @tuiPure
  toLink(contact: string | null): string {
    if (!contact) return '';

    return contact.replace(/\s+/g, '');
  }
}

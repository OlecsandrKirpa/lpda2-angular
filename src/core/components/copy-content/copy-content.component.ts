import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NotificationsService} from "@core/services/notifications.service";
import {TuiButtonModule} from "@taiga-ui/core";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-copy-content',
  standalone: true,
  imports: [
    TuiButtonModule,
    MatIcon
  ],
  templateUrl: './copy-content.component.html',
  styleUrl: './copy-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyContentComponent {
  private readonly notifications: NotificationsService = inject(NotificationsService);

  @Input({required: true}) content?: string | null;
  @Input() appearance: string = 'outline';
  @Input() size: 's' | 'm' | 'l' = 'm';

  @Input() copyHandler: (content: string | null) => void = this.defaultCopyHandler;
  @Input() message: string = $localize`Copiato`;

  copy(): void {
    this.copyHandler(this.content ?? null);
  }

  private defaultCopyHandler(c: string | null) {
    if (!(c)) return;

    navigator.clipboard.writeText(c).then((r: void): void => {
       this.notifications.fireSnackBar(this.message);
    });
  }
}

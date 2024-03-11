import {Injectable, inject} from '@angular/core';
import {nue} from '@core/lib/nue';
import {TuiAlertOptions, TuiAlertService, TuiDialogOptions, TuiDialogService, TuiNotification} from '@taiga-ui/core';
import {Observable, switchMap} from 'rxjs';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar} from "@angular/material/snack-bar";
import {PolymorpheusComponent, PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {TUI_PROMPT, TuiPromptData} from "@taiga-ui/kit";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private readonly alertService: TuiAlertService = inject(TuiAlertService);
  private readonly dialogs: TuiDialogService = inject(TuiDialogService);
  public snackBar: MatSnackBar = inject(MatSnackBar);

  fireSnackBar(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    if (!(typeof config == 'object')) config = {};
    if (!config.duration) config.duration = 1000;
    config.politeness ||= 'assertive';

    action ||= $localize`Done`;

    return this.snackBar.open(message, action, config);
  }

  open(message: string, params: Partial<TuiAlertOptions<any>>): Observable<any> {
    return this.alertService.open(message, params);
  }

  success(message: string, params: Partial<TuiAlertOptions<any>> = {}): void {
    this.open(message, {
      ...{
        status: TuiNotification.Success,
        hasIcon: true,
        autoClose: false,
        hasCloseButton: true,
      },
      ...params
    }).subscribe(nue());
  }

  error(message: string | null, params: Partial<TuiAlertOptions<any>> = {}): void {
    message ??= $localize`Qualcosa è andato storto. Riprova più tardi.`;

    this.open(message, {
      ...{
        status: TuiNotification.Error,
        hasIcon: true,
        autoClose: false,
        hasCloseButton: true,
      },
      ...params
    }).subscribe(nue());
  }

  confirm(content: TuiPromptData['content'], configs?: {
    yes?: string,
    no?: string,
    title?: string
  }): Observable<boolean> {
    const data: TuiPromptData = {
      content:
      content,
      yes: configs?.yes ?? $localize`Conferma`,
      no: configs?.no ?? $localize`Annulla`,
    };

    return this.dialogs
      .open<boolean>(TUI_PROMPT, {
        label: configs?.title ?? $localize`Sei sicuro?`,
        size: 's',
        data,
      });
  }
}

import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

export type StatusConfig = {
  [key: string]: {
    text: string,
    color?: string,
    icon?: string,
    description?: string,
    faIconClass?: string;
    matIcon?: string;
  }
};

@Component({
  selector: 'app-common-item-status',
  template: './common-item.status.html',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonItemStatus {

  @Input() status?: any;
  @Input() showDescription: boolean = false;

  /**
   * EXAMPLE
   * private readonly configs: { [key: string]: { text: string, color: string, icon: string, description: string } } = {
   *   active: { text: $localize`Attivo`, color: 'lime', icon: 'check', description: $localize`L'istanza è attiva.` },
   *   inactive: { text: $localize`Inattivo`, color: 'grey', icon: 'times', description: $localize`L'istanza non è selezionabile tra le possibili opzioni; ma ancora utilizzabile per gli elementi in cui è già stata selezionata.` },
   *   deleted: { text: $localize`Eliminato`, color: 'red', icon: 'trash', description: $localize`L'instanza è stata eliminata.` }
   * }
   */
  protected readonly configs: StatusConfig = {};

  get validStatus(): boolean {
    return this.validStatusFor(this.status);
  }

  get validConfig(): boolean {
    return this.validConfigFor(this.status);
  }

  get humanStatus(): string {
    return this.humanStatusFor(this.status);
  }

  get color(): string | undefined {
    return this.colorFor(this.status);
  }

  get icon(): string | undefined {
    return this.iconFor(this.status);
  }

  get humanDescription(): string | undefined {
    return this.humanDescriptionFor(this.status);
  }

  settingFor(status: any, configs = this.configs): StatusConfig[string]|undefined {
    if (!(this.validStatusFor(status) && this.validConfigFor(status))) return undefined;

    return configs[status as string];
  }

  validConfigFor(status: string | undefined, configs = this.configs): boolean {
    return (Object.keys(configs).indexOf(status as string) != -1);
  }

  validStatusFor(status: string | undefined): boolean {
    return (typeof status == 'string' && status != undefined && status != null && status.length > 0);
  }

  humanStatusFor(status: string, configs = this.configs): string {
    if (!this.validStatusFor(status)) return '(undefined)';

    if (!this.validConfigFor(status)) return status as string;

    return configs[status as string]["text"];
  }

  colorFor(status: any, configs = this.configs): string|undefined{
    if (!(this.validStatusFor(status) && this.validConfigFor(status))) return 'inherit';

    return configs[status as string]["color"];
  }

  iconFor(status: any, configs = this.configs): string|undefined{
    if (!(this.validStatusFor(status) && this.validConfigFor(status))) return '';

    return configs[status as string]["icon"];
  }

  humanDescriptionFor(status: any, configs = this.configs): string|undefined{
    if (!(this.validStatusFor(status) && this.validConfigFor(status))) return '';

    return configs[status as string]["description"];
  }
}
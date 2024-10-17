import { Component, Input } from '@angular/core';
import { PreorderType } from '@core/lib/interfaces/preorder-reservation-group-data';
import { PreorderReservationGroup } from '@core/models/preorder-reservation-group';
import { TuiHintModule } from '@taiga-ui/core';

@Component({
  selector: 'app-preorder-reservation-group-preorder-type',
  standalone: true,
  imports: [
    TuiHintModule,
  ],
  templateUrl: './preorder-reservation-group-preorder-type.component.html',
  styleUrl: './preorder-reservation-group-preorder-type.component.scss'
})
export class PreorderReservationGroupPreorderTypeComponent {
  // @Input() item?: PreorderReservationGroup;
  @Input() set item(value: PreorderReservationGroup | undefined) {
    this.type = value?.preorder_type;
  }

  @Input() type?: PreorderType;

  readonly trans: Record<PreorderType, { short: string, long: string }> = {
    nexi_payment: {
      short: $localize`Pagamento cc con nexi`,
      long: $localize`Verrà richiesto un pagamento con carta di credito del valore specificato al momento della prenotazione.`
    }
  }
}

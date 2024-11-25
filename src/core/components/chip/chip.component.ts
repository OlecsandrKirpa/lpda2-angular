import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  @Output() removeClick: EventEmitter<void> = new EventEmitter();
}

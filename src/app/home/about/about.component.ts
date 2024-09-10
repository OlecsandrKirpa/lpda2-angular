import { Component, inject } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  readonly _ = inject(Title).setTitle($localize`Chi siamo | La Porta D'Acqua`);
}

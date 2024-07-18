import { Component, HostBinding, HostListener, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-menu-icon',
  templateUrl: './menu-icon.component.html',
  styleUrls: ['./menu-icon.component.scss']
})
export class MenuIconComponent {

  @HostBinding('class.open')
  @Input() isOpen: boolean = false;

  @HostBinding('class.active')
  @Input() active: boolean = false;

  @HostBinding('style.--color')
  @Input() color?: string;

  private readonly defaults = {
    upper:'M 3.38361 6.14771 H 21.3836',
    middle:'M 3.38361 12.1477 H 21.3836',
    lower:'M3.38361 18.1477H21.3836'
  };

  upperD: string = this.defaults.upper;
  middleD: string = this.defaults.middle;
  lowerD: string = this.defaults.lower;

  @HostBinding('class.hovering')
  private hovering: boolean = false;

  @HostListener('mouseenter')
  onHover() {
    this.hovering = true;
  }

  @HostListener('mouseleave')
  onLeave() {
    this.hovering = false;
  }
}

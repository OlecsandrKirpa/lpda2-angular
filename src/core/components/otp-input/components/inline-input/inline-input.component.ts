import { Component, ElementRef, inject } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[appInlineInput]',
  standalone: true,
  imports: [],
  template: ``,
  styleUrl: `./inline-input.component.scss`
})
export class InlineInputComponent {

  private readonly elementRef: ElementRef = inject(ElementRef);

  get value(): string | undefined {
    const currentValue = this.elementRef.nativeElement.value;
    if(currentValue === null || currentValue === undefined) return undefined;
    return currentValue.toString();
  }

  focus(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();
    })
  }
}

import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';

const selector: string = `appAutosizeIframe`;

@Directive({
  selector: `iframe[appAutosizeIframe]`,
  standalone: true
})
export class AutosizeIframeDirective {
  constructor(
    private readonly el: ElementRef
  ) {
    setTimeout(() => this.resizeIframe(this.el.nativeElement), 2000);
  }

  @HostBinding('style.width.px')
  @HostBinding("width")
  @Input() width: number = 100;

  @HostBinding('style.height.px')
  @HostBinding("height")
  @Input() height: number = 100;

  @Input() appAutosizeIframe: boolean = true;

  @HostListener('load', ['$event'])
  onLoad(event: unknown): void {
    console.log(selector, `onLoad`, {event, el: this.el});
    this.resizeIframe(this.el.nativeElement);
  }

  @HostListener('DOMContentLoaded', ['$event'])
  onDOMContentLoaded(event: unknown): void {
    console.log(selector, `onDOMContentLoaded`, event);
  }

  private resizeIframe(iframe: HTMLIFrameElement): void {
    console.log(`resize`, { iframe, contentDocument: iframe.contentDocument, offsetHeight: iframe.offsetHeight});
    if (!(iframe && iframe.contentDocument)) return;

    this.width  += iframe.contentDocument.body.scrollWidth;
    this.height += iframe.contentDocument.body.scrollHeight;
  }
}

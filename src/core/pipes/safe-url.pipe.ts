import {inject, Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";


@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  transform(value: unknown): SafeUrl | null {
    if (!(typeof value === "string" && value.length > 0 && value.startsWith("http"))) {
      return null;
    }

    return this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, value);
  }
}


@Pipe({
  name: 'bypassSecurityTrustResourceUrl',
  standalone: true
})
export class BypassSecurityTrustResourceUrlPipe implements PipeTransform {
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  transform(value: unknown): SafeResourceUrl | null {
    if (!(typeof value === "string" && value.length > 0 && value.startsWith("http"))) {
      return null;
    }

    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
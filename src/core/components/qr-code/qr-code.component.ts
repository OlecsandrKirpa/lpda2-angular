import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FixMeLater, QRCodeModule} from "angularx-qrcode";
import {convertBase64ToBlob} from "@core/lib/convert-base64-to-blob";
import {MatIcon} from "@angular/material/icon";
import {TuiButtonModule} from "@taiga-ui/core";

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [
    QRCodeModule,
    MatIcon,
    TuiButtonModule
  ],
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent {

  @Input({required: true}) data!: string;

  saveAsImage(parent: FixMeLater, filename: string = `qrcode`): void {
    let parentElement = null;

    parentElement = parent.qrcElement.nativeElement
      .querySelector("canvas")
      .toDataURL("image/png");

    if (!parentElement) return;

    // converts base 64 encoded image to blobData
    const blobData: Blob = convertBase64ToBlob(parentElement);
    // saves as image
    const blob: Blob = new Blob([blobData], {type: "image/png"});
    const url: string = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // name of the file
    link.download = filename
    link.click()
  }
}

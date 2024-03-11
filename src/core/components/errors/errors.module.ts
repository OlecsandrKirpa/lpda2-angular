import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorsComponent } from './errors.component';
import { TuiErrorModule } from '@taiga-ui/core';



@NgModule({
  declarations: [
    ErrorsComponent
  ],
  imports: [
    CommonModule,
    TuiErrorModule
  ],
  exports: [
    ErrorsComponent
  ]
})
export class ErrorsModule { }

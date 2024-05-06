import {Component, forwardRef, Input, signal, SimpleChanges, WritableSignal} from '@angular/core';
import {TuiDataListWrapperModule, TuiItemsHandlers, TuiMultiSelectModule} from "@taiga-ui/kit";
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {
  PreferencesCommonInputComponent
} from "@core/components/preferences-inputs/preferences-common-input/preferences-common-input.component";
import {TuiExpandModule, TuiValueContentContext} from "@taiga-ui/core";
import {PolymorpheusContent} from "@tinkoff/ng-polymorpheus";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {
  PreferencesSelectComponent
} from "@core/components/preferences-inputs/preferences-select/preferences-select.component";
import {SubmitExpandComponent} from "@core/components/submit-expand/submit-expand.component";

@Component({
  selector: 'app-preferences-multiple-select',
  standalone: true,
  imports: [
    TuiDataListWrapperModule,
    TuiMultiSelectModule,
    ReactiveFormsModule,
    TuiExpandModule,
    SubmitExpandComponent
  ],
  templateUrl: './preferences-multiple-select.component.html',
  providers: [
    TuiDestroyService,

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreferencesMultipleSelectComponent),
      multi: true
    },
  ],
  outputs: [
    ...PreferencesCommonInputComponent.outputs
  ],
  inputs: [
    ...PreferencesCommonInputComponent.inputs,
  ]
})
export class PreferencesMultipleSelectComponent extends PreferencesCommonInputComponent<string[]> {
  @Input() items: string[] = [];

  shownItems: string[] = [];

  @Input() itemContent?: PolymorpheusContent<TuiValueContentContext<unknown>> = (a: TuiValueContentContext<unknown>) => this.stringifyFn(a.$implicit);

  @Input() noItemsContent: PolymorpheusContent<null> = $localize`Nessun elemento trovato`;

  search: string | null = ``;

  @Input() stringifyFn: TuiItemsHandlers<any>["stringify"] = (item: any): any => item;

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes['items']) this.shownItems = this.items;

    if (changes['search']) this.onSearchChange(this.search);
  }

  onSearchChange(search: string | null): void {
    this.search = search;

    this.shownItems = this.items.filter((item: string): boolean => {
      return item.toLowerCase().includes((this.search ?? ``).toLowerCase());
    });
  }
}

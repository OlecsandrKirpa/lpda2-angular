import {Component, forwardRef, Input, SimpleChanges} from '@angular/core';
import {TuiTextfieldControllerModule, TuiValueContentContext} from "@taiga-ui/core";
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {TuiDataListWrapperModule, TuiItemsHandlers, TuiSelectModule} from "@taiga-ui/kit";
import {
  PreferencesCommonInputComponent
} from "@core/components/preferences-inputs/preferences-common-input/preferences-common-input.component";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {PolymorpheusContent} from "@tinkoff/ng-polymorpheus";
import {SubmitExpandComponent} from "@core/components/submit-expand/submit-expand.component";

@Component({
  selector: 'app-preferences-select',
  standalone: true,
  imports: [
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    SubmitExpandComponent
  ],
  templateUrl: './preferences-select.component.html',
  providers: [
    TuiDestroyService,

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreferencesSelectComponent),
      multi: true
    },
  ]
})
export class PreferencesSelectComponent extends PreferencesCommonInputComponent<string> {
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

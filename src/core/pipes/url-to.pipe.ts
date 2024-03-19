import {Pipe, PipeTransform} from '@angular/core';

const pages: Record<string, Record<string, string>> = {
  menuCategory: {
    show: `/admin/menu/{itemId}`,
    duplicate: `/admin/menu/{itemId}/duplicate`,
    export: `/admin/menu/{itemId}/export`,
    createChild: `/admin/menu/{itemId}/create-category`,
    linkCategory: `/admin/menu/{itemId}/link-category`,
    createDish: `/admin/menu/{itemId}/create-dish`,
    linkDish: `/admin/menu/{itemId}/link-dish`,
  },
};

@Pipe({
  name: 'urlTo',
  standalone: true
})
export class UrlToPipe implements PipeTransform {

  transform(itemId: unknown, page: string): string | null {
    const resource: Record<string, string> = pages[page.split('.')[0]];
    if (!(resource)) throw new Error(`Resource not found: ${page} (resouce: ${page.split('.')[0]})`);
    const action: string = page.split('.')[1];
    if (!(resource[action])) throw new Error(`Action not found: ${page} (action: ${action})`);

    if (typeof itemId === 'undefined' || itemId === null) return null;
    if (typeof itemId === 'number') itemId = itemId.toString();

    if (typeof itemId !== 'string') throw new Error(`Invalid itemId: ${itemId} (type: ${typeof itemId})`);

    return resource[action].replace('{itemId}', itemId as string);
  }

}

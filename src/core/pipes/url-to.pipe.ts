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
    private: `/menu/{itemId}`, // Will include MenuDescription.secret_desc or MenuDescription.secret insted of id.
    public: `/menu/{itemId}`,
  },
  dish: {
    show: `/admin/menu/{categoryId}/dish/{itemId}`,
  },
};

@Pipe({
  name: 'urlTo',
  standalone: true,
  pure: true
})
export class UrlToPipe implements PipeTransform {

  transform(itemId: unknown, page: string): string | null {
    const resource: Record<string, string> = pages[page.split('.')[0]];
    if (!(resource)) throw new Error(`Resource not found: ${page} (resouce: ${page.split('.')[0]})`);
    const action: string = page.split('.')[1];
    if (!(resource[action])) throw new Error(`Action not found: ${page} (action: ${action})`);

    if (typeof itemId === 'undefined' || itemId === null) return null;
    if (typeof itemId === 'number') itemId = itemId.toString();

    /**
     * WHEN providing object: interpolate the object's keys into the URL.
     */
    if (typeof itemId == 'object' && itemId !== null && !Array.isArray(itemId)){
      let acc: string = resource[action];
      Object.keys(itemId).forEach((key: string) => {
        const value: string | undefined = (itemId as Record<string, string | undefined>)[key];
        if (value !== undefined && acc.includes(`{${key}}`)) acc = acc.replace(`{${key}}`, value ?? ``);
      });

      if (acc.includes(`{{`)) throw new Error(`Unresolved interpolation: ${acc}`);

      return acc;
    }

    if (typeof itemId !== 'string') throw new Error(`Invalid itemId: ${itemId} (type: ${typeof itemId})`);

    return resource[action].replace('{itemId}', itemId as string);
  }

}

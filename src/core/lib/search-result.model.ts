// import { BaseModel } from "./base-model";

import * as Joi from 'joi';

interface SearchResultData {
  items: any[];
  metadata: SearchResultMetadata;
}

export interface SearchResultMetadata {
  current_page: number;
  per_page: number;
  prev_page: number;
  next_page: number;
  total_pages: number;
  total_count: number;
  offset: number;
}

export function validSearchResultData(data: unknown, logErrors: boolean = true): data is SearchResultData {
  const schema = Joi.object({
    items: Joi.array().items(Joi.object()).required(),
    metadata: Joi.object().required()
  });

  const validation = schema.validate(data);

  if (validation.error && logErrors) console.error(`Invalid search result data:`, {
    validationErrors: validation.error,
    data
  });

  return (
    data instanceof Object &&
    Object.keys(data).length === 2 &&
    Object.keys(data).indexOf('items') !== -1 &&
    Object.keys(data).indexOf('metadata') !== -1 &&
    (validation.error === undefined || validation.error === null)
  );
}

/**
 * A helper class which allows to group search results into a single object, which
 * uses search result data to generate multiple instances of specified object type.
 */
export class SearchResult<T> {
  /**
   * The list of items returned by search result
   */
  items: T[];

  /**
   * Metadata of search result
   */
  metadata: SearchResultMetadata;

  /**
   * Create a new instance of `SearchResult<T>`.
   * @param data Search result response from which to get data
   * @param ctor The type of constructor to use for items creation
   */
  constructor(data: SearchResultData, ctor: new (data: any) => T) {
    this.items = data.items.map((item: T) => {
      return new ctor(item)
    });

    validSearchResultData(data);

    this.metadata = data.metadata;
  }

  get hasItems(): boolean {
    return typeof Array.isArray(this.items) && this.items.length > 0;
  }

  /**
   * Returns the number of current search result page.
   */
  get current_page(): number {
    return this.metadata.current_page;
  }


  /**
   * Returns the number of items per search result page.
   */
  get per_page(): number {
    return this.metadata.per_page;
  }


  /**
   * Returns the number of previous search result page.
   */
  get prev_page(): number {
    return this.metadata.prev_page;
  }


  /**
   * Returns the number of next search result page.
   */
  get next_page(): number {
    return this.metadata.next_page;
  }


  /**
   * Returns the number of total search result pages.
   */
  get total_pages(): number {
    return this.metadata.total_pages;
  }


  /**
   * Return total number of items matched by current search
   */
  get total_count(): number {
    return this.metadata.total_count;
  }


  /**
   * Returns a boolean which indicates if search result has a next page.
   */
  get has_next(): boolean {
    return this.next_page != undefined;
  }


  /**
   * Retusn a boolean which indicates if search result has a previous page.
   */
  get has_prev(): boolean {
    return this.prev_page != undefined;
  }

  get isEmpty(): boolean {
    return !(this.items && this.items.length > 0);
  }
}

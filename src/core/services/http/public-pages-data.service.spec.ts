import { TestBed } from '@angular/core/testing';

import { PublicPagesDataService } from './public-pages-data.service';

describe('PublicPagesDataService', () => {
  let service: PublicPagesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicPagesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

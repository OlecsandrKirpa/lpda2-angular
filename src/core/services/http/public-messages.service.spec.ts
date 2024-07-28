import { TestBed } from '@angular/core/testing';

import { PublicMessagesService } from './public-messages.service';

describe('PublicMessagesService', () => {
  let service: PublicMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

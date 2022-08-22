import { TestBed } from '@angular/core/testing';

import { ClientRightService } from './client-right.service';

describe('ClientRightService', () => {
  let service: ClientRightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientRightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

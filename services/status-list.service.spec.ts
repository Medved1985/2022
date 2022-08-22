import { TestBed } from '@angular/core/testing';

import { StatusListService } from './status-list.service';

describe('StatusListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusListService = TestBed.get(StatusListService);
    expect(service).toBeTruthy();
  });
});

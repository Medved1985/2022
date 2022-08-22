import { TestBed } from '@angular/core/testing';

import { StatusCreateListService } from './status-create-list.service';

describe('StatusCreateListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusCreateListService = TestBed.get(StatusCreateListService);
    expect(service).toBeTruthy();
  });
});

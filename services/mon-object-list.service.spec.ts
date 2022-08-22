import { TestBed } from '@angular/core/testing';

import { MonObjectListService } from './mon-object-list.service';

describe('MonObjectListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonObjectListService = TestBed.get(MonObjectListService);
    expect(service).toBeTruthy();
  });
});

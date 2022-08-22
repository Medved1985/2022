import { TestBed } from '@angular/core/testing';

import { MonObjectInfoListService } from './mon-object-info-list.service';

describe('MonObjectInfoListService', () => {
  let service: MonObjectInfoListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonObjectInfoListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

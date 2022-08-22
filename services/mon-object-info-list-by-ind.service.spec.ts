import { TestBed } from '@angular/core/testing';

import { MonObjectInfoListByIndService } from './mon-object-info-list-by-ind.service';

describe('MonObjectInfoListByIndService', () => {
  let service: MonObjectInfoListByIndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonObjectInfoListByIndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

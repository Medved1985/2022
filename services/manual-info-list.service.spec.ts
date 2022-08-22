import { TestBed } from '@angular/core/testing';

import { ManualInfoListService } from './manual-info-list.service';

describe('ManualInfoListService', () => {
  let service: ManualInfoListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualInfoListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

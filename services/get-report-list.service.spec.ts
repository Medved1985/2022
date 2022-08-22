import { TestBed } from '@angular/core/testing';

import { GetReportListService } from './get-report-list.service';

describe('GetReportListService', () => {
  let service: GetReportListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetReportListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

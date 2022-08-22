import { TestBed } from '@angular/core/testing';

import { GetReportParamsService } from './get-report-params.service';

describe('GetReportParamsService', () => {
  let service: GetReportParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetReportParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

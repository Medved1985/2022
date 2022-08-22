import { TestBed } from '@angular/core/testing';

import { GetGeneratedReportService } from './get-generated-report.service';

describe('GetGeneratedReportService', () => {
  let service: GetGeneratedReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetGeneratedReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

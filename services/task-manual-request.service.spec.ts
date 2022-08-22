import { TestBed } from '@angular/core/testing';

import { TaskManualRequestService } from './task-manual-request.service';

describe('TaskManualRequestService', () => {
  let service: TaskManualRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskManualRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

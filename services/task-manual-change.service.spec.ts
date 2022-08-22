import { TestBed } from '@angular/core/testing';

import { TaskManualChangeService } from './task-manual-change.service';

describe('TaskManualChangeService', () => {
  let service: TaskManualChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskManualChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

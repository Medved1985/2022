import { TestBed } from '@angular/core/testing';

import { TaskStatusChangeService } from './task-status-change.service';

describe('TaskStatusChangeService', () => {
  let service: TaskStatusChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStatusChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

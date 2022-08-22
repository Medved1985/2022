import { TestBed } from '@angular/core/testing';

import { TaskStatusChangeReqService } from './task-status-change-req.service';

describe('TaskStatusChangeService', () => {
  let service: TaskStatusChangeReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStatusChangeReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

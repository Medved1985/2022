import { TestBed } from '@angular/core/testing';

import { TaskRoleRequestService } from './task-role-request.service';

describe('TaskRoleRequestService', () => {
  let service: TaskRoleRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskRoleRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TaskRoleApplyService } from './task-role-apply.service';

describe('TaskRoleApplyService', () => {
  let service: TaskRoleApplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskRoleApplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

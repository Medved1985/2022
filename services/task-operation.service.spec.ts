import { TestBed } from '@angular/core/testing';

import { TaskOperationService } from './task-operation.service';

describe('TaskOperationService', () => {
  let service: TaskOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TaskTypeListService } from './task-type-list.service';

describe('TaskTypeListService', () => {
  let service: TaskTypeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTypeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

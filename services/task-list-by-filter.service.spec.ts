import { TestBed } from '@angular/core/testing';

import { TaskListByFilterService } from './task-list-by-filter.service';

describe('TaskListByFilterService', () => {
  let service: TaskListByFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskListByFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

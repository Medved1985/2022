import { TestBed } from '@angular/core/testing';

import { TaskListByRootTypeListService } from './task-list-by-root-type-list.service';

describe('TaskListByRootTypeListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskListByRootTypeListService = TestBed.get(TaskListByRootTypeListService);
    expect(service).toBeTruthy();
  });
});

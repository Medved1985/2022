import { TestBed } from '@angular/core/testing';

import { TaskChildListService } from './task-child-list.service';

describe('TaskChildListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskChildListService = TestBed.get(TaskChildListService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TaskCardInfoService } from './task-card-info.service';

describe('TaskCardInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskCardInfoService = TestBed.get(TaskCardInfoService);
    expect(service).toBeTruthy();
  });
});

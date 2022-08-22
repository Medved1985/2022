import { TestBed } from '@angular/core/testing';

import { TaskStatusTemplatePossibleService } from './task-status-template-possible.service';

describe('TaskStatusTemplatePossibleService', () => {
  let service: TaskStatusTemplatePossibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStatusTemplatePossibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

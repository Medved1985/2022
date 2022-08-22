import { TestBed } from '@angular/core/testing';

import { TaskFieldChangeService } from './task-field-change.service';

describe('TaskFieldChangeService', () => {
  let service: TaskFieldChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskFieldChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

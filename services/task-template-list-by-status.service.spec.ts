import { TestBed } from '@angular/core/testing';

import { TaskTemplateListByStatusService } from './task-template-list-by-status.service';

describe('TaskTemplateListByStatusService', () => {
  let service: TaskTemplateListByStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTemplateListByStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { NotificationTaskService } from './notification-task.service';

describe('NotificationTaskService', () => {
  let service: NotificationTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

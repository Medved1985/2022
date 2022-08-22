import { TestBed } from '@angular/core/testing';

import { NotificationTaskListService } from './notification-task-list.service';

describe('NotificationTaskListService', () => {
  let service: NotificationTaskListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationTaskListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

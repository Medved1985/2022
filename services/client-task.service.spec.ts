import { TestBed } from '@angular/core/testing';

import { ClientTaskService } from './client-task.service';

describe('ClientTaskService', () => {
  let service: ClientTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

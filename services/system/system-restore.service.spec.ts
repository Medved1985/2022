import { TestBed } from '@angular/core/testing';

import { SystemRestoreService } from './system-restore.service';

describe('SystemRestoreService', () => {
  let service: SystemRestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemRestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

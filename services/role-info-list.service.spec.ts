import { TestBed } from '@angular/core/testing';

import { RoleInfoListService } from './role-info-list.service';

describe('RoleInfoListService', () => {
  let service: RoleInfoListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleInfoListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

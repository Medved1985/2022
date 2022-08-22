import { TestBed } from '@angular/core/testing';

import { TunerRoleService } from './tuner-role.service';

describe('TunerRoleService', () => {
  let service: TunerRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TunerRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

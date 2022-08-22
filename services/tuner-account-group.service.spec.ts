import { TestBed } from '@angular/core/testing';

import { TunerAccountGroupService } from './tuner-account-group.service';

describe('TunerAccountGroupService', () => {
  let service: TunerAccountGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TunerAccountGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

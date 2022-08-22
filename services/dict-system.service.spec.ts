import { TestBed } from '@angular/core/testing';

import { DictSystemService } from './dict-system.service';

describe('DictSystemService', () => {
  let service: DictSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DictSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

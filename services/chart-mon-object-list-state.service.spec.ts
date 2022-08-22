import { TestBed } from '@angular/core/testing';

import { ChartMonObjectListStateService } from './chart-mon-object-list-state.service';

describe('ChartMonObjectListStateService', () => {
  let service: ChartMonObjectListStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartMonObjectListStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

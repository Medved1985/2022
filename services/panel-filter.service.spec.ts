import { TestBed } from '@angular/core/testing';

import { PanelFilterService } from './panel-filter.service';

describe('PanelFilterService', () => {
  let service: PanelFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

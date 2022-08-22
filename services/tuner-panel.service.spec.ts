import { TestBed } from '@angular/core/testing';

import { TunerPanelService } from './tuner-panel.service';

describe('TunerPanelService', () => {
  let service: TunerPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TunerPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

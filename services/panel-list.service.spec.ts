import { TestBed } from '@angular/core/testing';

import { PanelListService } from './panel-list.service';

describe('PanelListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PanelListService = TestBed.get(PanelListService);
    expect(service).toBeTruthy();
  });
});

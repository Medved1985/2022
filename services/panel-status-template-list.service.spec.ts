import { TestBed } from '@angular/core/testing';

import { PanelStatusTemplateListService } from './panel-status-template-list.service';

describe('PanelStatusTemplateListService', () => {
  let service: PanelStatusTemplateListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelStatusTemplateListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

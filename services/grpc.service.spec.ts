import { TestBed } from '@angular/core/testing';

import { GrpcService } from './grpc.service';

describe('GrpcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrpcService = TestBed.get(GrpcService);
    expect(service).toBeTruthy();
  });
});

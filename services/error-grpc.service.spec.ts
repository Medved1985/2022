import { TestBed } from '@angular/core/testing';

import { ErrorGrpcService } from './error-grpc.service';

describe('ErrorGrpcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorGrpcService = TestBed.get(ErrorGrpcService);
    expect(service).toBeTruthy();
  });
});

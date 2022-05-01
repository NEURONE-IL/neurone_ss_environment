import { TestBed } from '@angular/core/testing';

import { BehaviorModelService } from './behavior-model.service';

describe('BehaviorModelService', () => {
  let service: BehaviorModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BehaviorModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

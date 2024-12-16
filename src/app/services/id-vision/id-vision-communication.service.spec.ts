import { TestBed } from '@angular/core/testing';

import { IdVisionCommunicationService } from './id-vision-communication.service';

describe('IdVisionCommunicationService', () => {
  let service: IdVisionCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdVisionCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

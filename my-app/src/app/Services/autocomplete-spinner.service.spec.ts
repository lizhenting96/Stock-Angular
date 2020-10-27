import { TestBed } from '@angular/core/testing';

import { AutocompleteSpinnerService } from './autocomplete-spinner.service';

describe('AutocompleteSpinnerService', () => {
  let service: AutocompleteSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutocompleteSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

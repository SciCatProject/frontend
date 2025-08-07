import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NumericRangeFormService } from './numeric-range-form.service';

describe('NumericRangeFormService', () => {
	let service: NumericRangeFormService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			providers: [NumericRangeFormService]
		});
		service = TestBed.inject(NumericRangeFormService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      rating: [null, [ratingValidator(1, 5)]],
      notification: ['email'],
      sendCatalog: [],
    });
  }

  setNofication(value: string): void {
    let phoneControl: AbstractControl = this.customerForm.get('phone');
    if (value === 'text') {
      phoneControl.setValidators([Validators.required]);
    } else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
  }

  save(customerForm): void {}
}

function ratingValidator(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (
      c.value !== null &&
      (isNaN(c.value) || c.value < min || c.value > max)
    ) {
      return { rating: true };
    }
    return null;
  };
}

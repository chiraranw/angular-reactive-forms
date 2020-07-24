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
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();
  ///
  emailMsg: string;
  private emailValidationMsg = {
    required: 'Email is required',
    email: 'Enter valid email',
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.formBuilder.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', [Validators.required, Validators.email]],
        },
        { validators: [emailMatcher] }
      ),
      phone: ['', [Validators.required]],
      rating: [null, [ratingValidator(1, 5)]],
      notification: ['email'],
      sendCatalog: [],
    });

    this.customerForm
      .get('notification')
      .valueChanges.subscribe((value) => this.setNofication(value));

    const emailControl: AbstractControl = this.customerForm.get(
      'emailGroup.email'
    );
    emailControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => this.setEmailValidationMsg(emailControl));
  }

  private setEmailValidationMsg(control: AbstractControl): void {
    this.emailMsg = '';
    if ((control.touched || control.dirty) && control.errors) {
      this.emailMsg = Object.keys(control.errors)
        .map((key) => this.emailValidationMsg[key])
        .join(' ');
    }
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

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  if (c.get('email').pristine || c.get('confirmEmail').pristine) {
    return null;
  }
  if (c.get('email').value !== c.get('confirmEmail').value) {
    return { emailMatcher: true };
  }

  return null;
}

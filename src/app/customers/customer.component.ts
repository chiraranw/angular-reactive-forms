import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';

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
      firstName: [],
      lastName: [],
      email: [],
      sendCatalog: [],
    });
  }

  save(customerForm): void {}
}

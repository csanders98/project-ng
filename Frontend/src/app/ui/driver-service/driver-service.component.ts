import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-driver-service',
  templateUrl: './driver-service.component.html',
  styleUrls: ['./driver-service.component.scss']
})
export class DriverServiceComponent implements OnInit {
  address: string;
  amount: number;
  direction: any;
  transactionForm: FormGroup;

  options = [
    { id: 0, name: "Download Practice Exam" },
    { id: 1, name: "Get REAL ID" },
    { id: 2, name: "Obtain a Vital Record"}
  ];

  vitalRecordOptions = [
    "Birth Certificate",
    "Death Certificate",
    "Marriage Certificate",
    "Divorce Certificate"
  ];

  get additionalInfo() { return this.transactionForm.get('additionalInfo') as FormArray };

  constructor(private fb: FormBuilder, private contract: ContractService) {
    this.transactionForm = new FormGroup({
      selectedOption: new FormControl("", [Validators.required]),
      additionalInfo: new FormArray([], Validators.required)
    });


    contract
      .connectAccount()
      .then((value: any) => {
        this.direction = value;
      })
      .catch((error: any) => {
        console.log(error);
        contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  ngOnInit(): void {
    this.transactionForm.get('selectedOption').valueChanges.subscribe((value) => {
      this.handleOptionChange(value);
    });
  }

  postEvent(e) {
    console.log(e);
    this.address = this.transactionForm.value.sendaddress;
    this.amount = this.transactionForm.value.amount;
    let data = {
      'action': this.options.find(opt => opt.id === this.transactionForm.value.selectedOption).name
    };
    this.additionalInfo.controls.forEach(element => {
      data[element['name']] = element.value;
    });

    this.contract
      .postTransaction(this.direction, data)
      .then((r) => {
        console.log(r);
        this.contract.success();
      })
      .catch((e) => {
        console.log(e);
        this.contract.failure("Transaction failed");
      });
  }

  private handleOptionChange(value) {
    this.additionalInfo.clear();
    switch (value) {
      case 0:
        let licensePlate = new FormControl("", Validators.required);
        licensePlate['name'] = "Email Address";
        this.additionalInfo.push(licensePlate);
        break;
      case 1:
        let passportNumber = new FormControl("", Validators.required);
        passportNumber['name'] = "Passport Number";
        let ssn = new FormControl("", Validators.required);
        ssn['name'] = "Social Security Number";
        let licenseNumber = new FormControl("", Validators.required);
        licenseNumber['name'] = "Drivers License Number";

        this.additionalInfo.push(passportNumber);
        this.additionalInfo.push(ssn);
        this.additionalInfo.push(licenseNumber);

        break;
      case 2:
        let vitalRecord = new FormControl("", Validators.required);
        vitalRecord['name'] = "Vital Record";
        vitalRecord['type'] = "select";
        vitalRecord['options'] = this.vitalRecordOptions;

        let licenseNumber2 = new FormControl("", Validators.required);
        licenseNumber2['name'] = "License Number";

        let relationshipTo = new FormControl("", Validators.required);
        relationshipTo['name'] = "Relationship To Person";

        this.additionalInfo.push(vitalRecord);
        this.additionalInfo.push(licenseNumber2);
        this.additionalInfo.push(relationshipTo);
        break;
      default:
        break;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-vehicle-service',
  templateUrl: './vehicle-service.component.html',
  styleUrls: ['./vehicle-service.component.scss']
})
export class VehicleServiceComponent implements OnInit {
  address: string;
  amount: number;
  direction: any;
  transactionForm: FormGroup;

  options = [
    { id: 0, name: "Sell Vehicle" },
    { id: 1, name: "Donate Vehicle" },
    { id: 2, name: "Title Your Vehicle"}
  ];

  get additionalInfo() { return this.transactionForm.get('additionalInfo') as FormArray };

  constructor(private fb: FormBuilder, private contract: ContractService, private snackbar: MatSnackBar) {
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
        this.success();
      })
      .catch((e) => {
        console.log(e);
        this.contract.failure("Transaction failed");
        this.error();
      });
  }
  private handleOptionChange(value) {
    this.additionalInfo.clear();
    switch (value) {
      case 0:
        let newLicenseNumber = new FormControl("", Validators.required);
        newLicenseNumber['name'] = "New Owner License Number";
        this.additionalInfo.push(newLicenseNumber);

        let licensePlate = new FormControl("", Validators.required);
        licensePlate['name'] = "License Plate";
        this.additionalInfo.push(licensePlate);
        break;
      case 1:
        let donatedTo = new FormControl("", Validators.required);
        donatedTo['name'] = "Donated to";
        this.additionalInfo.push(donatedTo);

        let licensePlate2 = new FormControl("", Validators.required);
        licensePlate2['name'] = "License Plate";
        this.additionalInfo.push(licensePlate2);

        break;
      case 2:
        let fullName = new FormControl("", Validators.required);
        fullName['name'] = "Full Name";
        let addressLine1 = new FormControl("", Validators.required);
        addressLine1['name'] = "Address Line 1";
        let addressLine2 = new FormControl("");
        addressLine2['name'] = "Address Line 2";
        let city = new FormControl("", Validators.required);
        city['name'] = "City";
        let zipcode = new FormControl("", Validators.required);
        zipcode['name'] = "Zipcode";
        this.additionalInfo.push(fullName);
        this.additionalInfo.push(addressLine1);
        this.additionalInfo.push(addressLine2);
        this.additionalInfo.push(city);
        this.additionalInfo.push(zipcode);
        break;
      default:
        break;
    }
  }

  success() {
   this.snackbar.open("Transaction Complete!", "", {duration: 4000})
   this.additionalInfo.clear();
   this.transactionForm.get('selectedOption').setValue(null)
  }

  error() {
    this.snackbar.open("Transaction Error!", "", {duration: 4000})
  }
}

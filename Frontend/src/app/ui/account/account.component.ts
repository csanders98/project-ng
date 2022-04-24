import { ContractService } from "./../../services/contract/contract.service";
import { Component } from "@angular/core";
/*import { ThreeBox } from "../../services/3box.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Identicon } from "../../services/identicon";
import { Md5 } from "ts-md5/dist/md5";*/

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent {
  direction: string;
  balance: string;
  //profile;
  //url;
  data = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

  columns =  ['name', 'weight', 'symbol', 'position'];

  constructor(
    private contract: ContractService,
    //private sanitizer: DomSanitizer,
    //private threebox: ThreeBox
  ) {
    this.contract
      .connectAccount()
      .then((value: any) => {
        this.direction = value;
        this.getDetails(this.direction);
       /* this.profile = this.threebox.getProfile(this.direction).then((response) => {
            console.log(response);
            this.profile = response;
            this.url = this.profile.image[0].contentUrl["/"];
          });
        this.getImage(this.direction);*/
      })
      .catch((error: any) => {
        this.contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  /*getImage(account) {
    this.data = this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/svg+xml; utf8," +
      encodeURI(
        new Identicon(Md5.hashStr(account), {
          size: 32,
          format: "svg",
        }).toString(true)
      )
    );
  }*/

  navigateTo() {
    window.open("https://metamask.io/");
  }

  connectAccount() {
    this.contract
      .connectAccount()
      .then((value: any) => {
        console.log(value);
        this.direction = value;
        this.getDetails(this.direction);
      })
      .catch((error: any) => {
        this.contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  // action() {
  //     this.contract
  //     .accountTransactions(this.direction)
  //     .then((value: any) => {
  //       // debugger
  //     })
  //     .catch((error: any) => {
  //       this.contract.failure(
  //         "Could't get the account data, please check if metamask is running correctly and refresh the page"
  //       );
  //     });

  // }

  getDetails(account) {
    this.contract
      .accountInfo(account)
      .then((value: any) => {
        this.balance = value;
      })
      .catch((error: any) => {
        this.contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }
}

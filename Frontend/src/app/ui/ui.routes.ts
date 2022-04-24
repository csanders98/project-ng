import { Routes } from '@angular/router';

// Components
import {AccountComponent} from "./account/account.component";
import { DriverServiceComponent } from './driver-service/driver-service.component';
import {HomeComponent} from "./home/home.component";
import { OnlineServiceComponent } from './online-service/online-service.component';
import {TransactionComponent} from "./transaction/transaction.component";
import { VehicleServiceComponent } from './vehicle-service/vehicle-service.component';

export const UiRoute: Routes = [
  { path: '', redirectTo: 'money', pathMatch: 'full'},
  { path: 'money', component: TransactionComponent },
  { path: 'home', component: HomeComponent},
  { path: 'account', component: AccountComponent},
  { path: 'online-service', component: OnlineServiceComponent},
  { path: 'driver-service', component: DriverServiceComponent},
  { path: 'vehicle-service', component: VehicleServiceComponent},
  { path: '**', redirectTo: '/404' },
];

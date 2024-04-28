import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { EmployeeRoutingModule } from './component/employee/employee-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    EmployeeRoutingModule
  ]
})
export class AppModule { }

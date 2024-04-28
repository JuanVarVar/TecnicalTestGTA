import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { EmployeeComponent} from './component/employee/employee.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    EmployeeComponent
  ]
})
export class AppModule { }

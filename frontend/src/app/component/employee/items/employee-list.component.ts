import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {Data} from '../interface/data';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit{

      
  constructor(private service:EmployeeService){
    
  }

  isLoading: boolean = false;

  public employeesList$!: Observable<Data>;
  public searchText = "";
  public offset = 0;
  
  search(): void {
    if(this.searchText == ""){
      this.employeesList$ = this.service.getEmployees();
    }else{
      this.employeesList$ = this.service.getEmployeesCriteria(this.searchText);
    }
   
  }

  onChangeSearch(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.offset =   !!isNaN(Number(newValue))? parseInt(newValue) : 0;
  }

  onChangeOffset(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.searchText = newValue;
  }


  ngOnInit(): void {

    this.search();
    
  }

 
}

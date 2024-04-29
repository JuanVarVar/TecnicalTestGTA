import { Component } from '@angular/core';
import { AsyncPipe,NgIf} from '@angular/common';
import { EmployeeService } from './services/employee.service';

import { EmployeeListComponent } from './items/employee-list.component';

@Component({

  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeListComponent,AsyncPipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})

export class EmployeeComponent  {


  constructor(private service:EmployeeService){
    
  }


}

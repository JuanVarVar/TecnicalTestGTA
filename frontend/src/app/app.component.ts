import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeService } from './component/employee/services/employee.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit{
  title = 'frontend';

  employees: any = {};

  constructor(private service:EmployeeService){
    
  }

  ngOnInit(): void {

    this.service.getEmployees().subscribe(employees => {
      this.employees = employees;
    })
    
  }
}


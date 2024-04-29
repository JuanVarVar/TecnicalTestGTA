import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { Data, User, ValidationError, formError } from '../interface/data';
import { EmployeeService } from '../services/employee.service';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [AsyncPipe, NgIf, ReactiveFormsModule,FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  public formulario: FormGroup;

  constructor(
    private service: EmployeeService,
    private formBuilder: FormBuilder
  ) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const date = `${year}-${month}-${day}`;

    this.formulario = this.formBuilder.group({
      firstName: [null, []],
      firstLastName: [null, []],
      secondLastName: [null, []],
      otherName: [null, []],
      country: ['Colombia', Validators.required],
      document: ['Cédula de Ciudadanía', Validators.required],
      startDate: [date, Validators.required],
      identification: [null,[]],
      area: ['Administración', Validators.required],
    });
  }

  isLoading: boolean = false;

  public employeesList$!: Observable<Data>;
  public renderList: User[] = [];
  public searchText = '';
  public offset = 1;
  public Oldoffset = 1;
  public lockView = 0;
  public load = false;
  public startDateDefault = new Date();
  public errors: formError = {
    id: [],
    firstName: [],
    firstLastName: [],
    secondLastName: [],
    otherName: [],
    country: [],
    document: [],
    startDate: [],
    area: [],
    identification: []
  };

  public errorSystem = '';
  public success = '';
  public noPress = false;

  public addEmployee = false;
  public updateEmployee = false;
  public deleteEmployee = false;
  public idSelector = '';

  public search(): void {
    var page = this.offset.toString();
    if (this.searchText == '') {
      this.load = true;
      this.service.getEmployees(page).subscribe(
        (response: any) => {
          this.load = false;
          this.employeesList$ = response;
          this.renderList = response.data;
        },
        (error: any) => {
          this.systemError(error.error);
          this.load = false;
        }
      );
    } else {
      this.offset = 1;
      this.load = true;
      this.service.getEmployeesCriteria(page,this.searchText).subscribe(
        (response: any) => {
          this.load = false;
          this.employeesList$ = response;
          this.renderList = response.data;
        },
        (error: any) => {
          this.systemError(error.error);
          this.load = false;
        }
      );
    }
  }


  public onChangeSearch(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.offset = 1;
    this.searchText = newValue;
    this.restForm();
  }

  public onChangeOffset(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    console.log(newValue);
    this.offset = !isNaN(Number(newValue)) ? parseInt(newValue) : 1;
    if (this.lockView == 0 || this.offset <= this.lockView) {
      this.search();  
    }
  }

  public addEmployeForm() {
    if (this.addEmployee) {
      this.addEmployee = false;
    } else {
      this.addEmployee = true;
    }
  }

  public onSubmit() {
    if (this.formulario.valid &&  !this.noPress) {
      this.noPress = true;
      if (this.addEmployee) {
        this.service.addEmployees(this.formulario.value).subscribe(
          (response: any) => {
            this.restForm();
            this.success = response.message;
            this.search();
            this.noPress = false;
          },
          (error: any) => {
            if (error.status == 403) {
              this.validationError(error.error);
            } else {
              this.systemError(error.error);
            }
            this.noPress = false;
          }
        );
      } else if (this.updateEmployee) {
        this.service
          .updateEmployee(this.idSelector, this.formulario.value)
          .subscribe(
            (response: any) => {
              this.restForm();
              this.success = response.message;
              this.search();
              this.noPress = false;
            },
            (error: any) => {
              if (error.status == 403) {
                this.validationError(error.error);
              } else {
                this.systemError(error.error);
              }
              this.noPress = false;
            }
          );
      }
    }
  }

  public getEmployeeData(e: string) {
    this.restForm();
    this.idSelector = e;
    this.service.getEmployee(e).subscribe(
      (response: any) => {
        this.updateEmployee = true;
        this.loadFormUpdate(response.data);
      },
      (error: any) => {
        if (error.status == 403) {
          this.validationError(error.error);
        } else {
          this.systemError(error.error);
        }
      }
    );
  }

  public loadFormUpdate(e: User) {
    this.formulario = this.formBuilder.group({
      firstName: [e.firstName, []],
      firstLastName: [e.firstLastName, []],
      secondLastName: [e.secondLastName, []],
      otherName: [e.otherName, []],
      country: [e.country, Validators.required],
      document: [e.document, Validators.required],
      startDate: [null, []],
      identification: [e.identification, []],
      area: [e.area, Validators.required],
    });
  }

  public onDelete(e: string) {
    this.restForm();
    this.deleteEmployee = true;
    this.idSelector = e;
  }

  public deleteEmployeeData(e: boolean) {
    if (!this.noPress) {
      if (e) {
        this.noPress = true;
        this.service.deleteEmployee(this.idSelector).subscribe(
          (response: any) => {
            this.restForm();
            this.success = response.message;
            this.search();
            this.noPress = false;
          },
          (error: any) => {
            if (error.status == 403) {
              alert(error.error.message);
            } else {
              alert(error.error.message);
            }
            this.noPress = false;
          }
        );
      } else {
        this.restForm();
      }
    }
  }

  public restForm() {
    this.addEmployee = false;
    this.updateEmployee = false;
    this.deleteEmployee = false;

    this.idSelector = '';

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const date = `${year}-${month}-${day}`;

    this.errorSystem = '';

    this.errors = {
      id: [],
      firstName: [],
      firstLastName: [],
      secondLastName: [],
      otherName: [],
      country: [],
      document: [],
      startDate: [],
      area: [],
      identification: []
    };

    this.formulario = this.formBuilder.group({
      firstName: [null, []],
      firstLastName: [null, []],
      secondLastName: [null, []],
      otherName: [null, []],
      country: ['Colombia', Validators.required],
      document: ['Cédula de Ciudadanía', Validators.required],
      startDate: [date, Validators.required],
      identification: [null, []],
      area: ['Administración', Validators.required],
    });
  }

  public validationError(e: ValidationError) {
    this.errors = e.data;
  }

  public systemError(e: Data) {
    this.errors = {
      id: [],
      firstName: [],
      firstLastName: [],
      secondLastName: [],
      otherName: [],
      country: [],
      document: [],
      startDate: [],
      area: [],
      identification:[]
    };
    this.errorSystem = e.message;
  }

  ngOnInit(): void {
    this.search();
  }
}

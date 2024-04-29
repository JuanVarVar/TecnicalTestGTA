import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { Data, User, ValidationError, formError } from '../interface/data';
import { EmployeeService } from '../services/employee.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [AsyncPipe, NgIf, ReactiveFormsModule],
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
      area: ['Administración', Validators.required],
    });
  }

  isLoading: boolean = false;

  public maxRender = 10;
  public maxPreRender = 50;
  public employeesList$!: Observable<Data>;
  public renderList: User[] = [];
  public searchText = '';
  public offset = 1;
  public Oldoffset = 1;
  public OldoffsetValue = 1;
  public offsetValue = 1;
  public lockView = 0;
  public maxPage = this.maxRender;
  public minPage = 0;
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
  };

  public errorSystem = '';
  public success = '';
  public noPress = false;

  public addEmployee = false;
  public updateEmployee = false;
  public deleteEmployee = false;
  public idSelector = '';

  public search(): void {
    var lockView = 0;
    if (this.searchText == '') {
      this.load = true;
      this.service.getEmployees().subscribe(
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
      this.load = true;
      this.service.getEmployeesCriteria(this.searchText).subscribe(
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

  public updatePage() {
    var items = Object.keys(this.renderList).length;
    var min = this.offsetValue * this.maxRender - this.maxRender;
    var max = this.offsetValue * this.maxRender;

    if ((max > items && items < this.maxPreRender) || items < this.maxRender) {
      max = items;
      min = this.offsetValue * this.maxRender;
      while (min > max) {
        min -= this.maxRender;
      }
    }

    this.maxPage = max;
    this.minPage = min;
  }

  public offsetRealValue(): void {
    if (Object.keys(this.renderList).length == this.maxPreRender) {
      if (this.offset > 1) {
        var paginaActual = this.offset;
        var maxDataRender = Math.ceil(this.maxPreRender / this.maxRender);
        var cycles = 0;

        while (paginaActual > maxDataRender) {
          paginaActual -= maxDataRender;
          cycles++;
        }

        this.offsetValue = paginaActual;

        var diference = maxDataRender - this.OldoffsetValue;

        if (
          this.offset != 1 &&
          (this.Oldoffset < this.offset - diference ||
            this.Oldoffset > this.offset + diference)
        ) {
          this.search();
        }

        this.OldoffsetValue = this.offsetValue;
        this.Oldoffset = this.offset;
        this.updatePage();
      } else {
        this.offset = 1;
      }
    } else {
      var items = Object.keys(this.renderList).length;

      var paginaActual = this.offset;
      var maxDataRender = Math.ceil(this.maxPreRender / this.maxRender);
      var cycles = 0;

      while (paginaActual > maxDataRender) {
        paginaActual -= maxDataRender;
        cycles++;
      }

      if (paginaActual * this.maxRender < items) {
        this.OldoffsetValue = this.offsetValue;
        this.Oldoffset = this.offset;
        this.offsetValue = paginaActual;
        this.updatePage();
      } else {
        var newOffsetValue = paginaActual;
        var newOffset = this.offset;

        while ((newOffsetValue - 1) * this.maxRender > items) {
          newOffsetValue -= 1;
          newOffset -= 1;
        }

        this.lockView = newOffset;

        this.OldoffsetValue = newOffsetValue;
        this.Oldoffset = newOffset;
        this.offset = newOffset;
        this.offsetValue = newOffsetValue;
        this.updatePage();
      }
    }
  }

  public onChangeSearch(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.offset = 1;
    this.searchText = newValue;
  }

  public onChangeOffset(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.offset = !isNaN(Number(newValue)) ? parseInt(newValue) : 1;
    if (this.lockView == 0 || this.offset <= this.lockView) {
      this.offsetRealValue();
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
      area: [e.area, Validators.required],
    });
  }

  public onDelete(e: string) {
    this.restForm();
    this.deleteEmployee = true;
    this.idSelector = e;
    console.log(e);
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
    };

    this.formulario = this.formBuilder.group({
      firstName: [null, []],
      firstLastName: [null, []],
      secondLastName: [null, []],
      otherName: [null, []],
      country: ['Colombia', Validators.required],
      document: ['Cédula de Ciudadanía', Validators.required],
      startDate: [date, Validators.required],
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
    };
    this.errorSystem = e.message;
  }

  ngOnInit(): void {
    this.search();
  }
}

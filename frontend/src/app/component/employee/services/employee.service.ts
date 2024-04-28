import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  private API = "http://localhost:8000/api/employee/";

  constructor(private http:HttpClient) { }

  public getEmployees(): Observable<any>{
      return this.http.get(this.API);
  }

  public getEmployeesCriteria(e: string): Observable<any>{
    return this.http.post(this.API+"criteria",{"criteria":e},{ headers: { 'Content-Type': 'application/json' }});
  }
}

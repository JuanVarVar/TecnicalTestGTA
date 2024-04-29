import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  private API = "http://localhost:8000/api/employee/";

  constructor(private http:HttpClient) { }

  public getEmployees(e:string): Observable<any>{
      return this.http.get(this.API+e+"/none");
  }

  public getEmployee(e:string): Observable<any>{
    return this.http.get(this.API+e);
  }

  public getEmployeesCriteria(e: string,z: string): Observable<any>{
    return this.http.post(this.API+"criteria",{"criteria":z,"offset":e},{ headers: { 'Content-Type': 'application/json' }});
  }

  public addEmployees(e: any): Observable<any>{
    return this.http.post(this.API,e,{ headers: { 'Content-Type': 'application/json' }});
  }

  public updateEmployee(e: string, z: any): Observable<any>{
    return this.http.put(this.API+e,z,{ headers: { 'Content-Type': 'application/json' }});
  }
  
  public deleteEmployee(e:string): Observable<any>{
    return this.http.delete(this.API+e);
  }

}

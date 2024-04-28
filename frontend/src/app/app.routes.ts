import { Routes } from '@angular/router';
import { EmployeeComponent } from './component/employee/employee.component';

export const routes: Routes = [
    { path: '', redirectTo: 'employee', pathMatch: 'full' },
    { path: 'employee', component: EmployeeComponent },
    // otras rutas de tu aplicación
];

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:59107/api/grid'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/EmpDetails`);
  }
    deleteEmployee(empId: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/delete/${empId}`);
    }

    // Update employee
    updateEmployee(employee: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/update`, employee);
    }

    registerEmployee(employee: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/register`, employee).pipe(
        catchError((error: HttpErrorResponse) => {
          // Return the error message to the component
          return throwError(error);
        })
      );
    }

    generateNextId() {
      return this.http.get<{ nextId: string }>(`${this.apiUrl}/generateNextId`);
    }

  }


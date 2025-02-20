import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuGroup {

  private apiUrl  = 'http://localhost:59107/api/grid'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}



  getDDdata(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetDdata`);
  }}

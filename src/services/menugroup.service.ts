import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuGroup {

  private apiUrl  = 'http://localhost:59107/api/grid'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}



  getDDdata(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetDdata`);
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveMenuData`, data);  // Adjust the endpoint accordingly
  }

  updateItem(id: number, menuData: any): Observable<any> {
    console.log("Sending ID to API:", id); // Debugging log
    console.log("Sending Data to API:", menuData); // Debugging log

    return this.http.put(`${this.apiUrl}/Update/${id}`, menuData);
  }

  // Delete Menu Item
  deleteMenuItem(item: any): Observable<any> {
    return this.http.request('DELETE', `${this.apiUrl}/Delete`, {
      body: item, // Explicitly send the body
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  Submit(FormData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Submit`, FormData);  // Adjust the endpoint accordingly
  }


}
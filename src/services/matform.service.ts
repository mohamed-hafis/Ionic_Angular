import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatForm {
  private apiUrl  = 'http://localhost:59107/api/grid'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}



  getDDdata(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetDDdata`);
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveData`, data);  // Adjust the endpoint accordingly
  }

  // Update record (use PUT request)
  updateData(formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateData`, formData);
  }

  getRecordForEdit(cid: string, menuId: string) {
    return this.http.get(`${this.apiUrl}/GetRecordForEdit/${cid}/${menuId}`);
}

// checkMenuIdExists(menuID: string, menuName: string): Observable<any> {
//   return this.http.post<any>(`${this.apiUrl}/CheckMenuId`, {
//     MenuID: menuID,
//     MenuName: menuName
//   });
// }


// Delete record (use DELETE request)
   deleteData(cid: string, menuId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteData/${cid}/${menuId}`);  // Adjust the endpoint accordingly
  }
}

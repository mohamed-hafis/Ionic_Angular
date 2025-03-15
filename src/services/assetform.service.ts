import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetformService {

  private apiUrl = 'http://localhost:59107/api'; // Replace with your API endpoint

   constructor(private http: HttpClient) {}

   getDDdata(): Observable<any> {
       return this.http.get<any>(`${this.apiUrl}/GetData`);
     }
   
     saveAssetData(assetData : any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/SaveData`, assetData);
    }
     updateAssetData(assetData: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/GetData`, assetData);
    }
     
}

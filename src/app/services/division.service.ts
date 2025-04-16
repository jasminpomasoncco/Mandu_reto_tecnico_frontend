import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Division } from '../models/division.model';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  private baseUrl = 'http://localhost:3000/division';

  constructor(private http: HttpClient) {}

  getDivisions(): Observable<Division[]> {
    console.log('URL de la API:', `${this.baseUrl}`);
    return this.http.get<Division[]>(this.baseUrl).pipe(
      tap(data => console.log('Datos recibidos del servidor:', data))
    );
  }

  getDivision(id: number): Observable<Division> {
    return this.http.get<Division>(`${this.baseUrl}/${id}`);
  }

  getSubdivisions(id: number): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.baseUrl}/${id}/subdivisiones`);
  }

  createDivision(data: Partial<Division>): Observable<Division> {
    return this.http.post<Division>(this.baseUrl, data);
  }

  updateDivision(id: number, data: Partial<Division>): Observable<Division> {
    return this.http.put<Division>(`${this.baseUrl}/${id}`, data);
  }

  deleteDivision(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

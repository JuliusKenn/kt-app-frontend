import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FamilyTree {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class FamilyTreeService {
  private apiUrl = `${environment.apiUrl}/family-trees`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<FamilyTree[]>> {
    return this.http.get<ApiResponse<FamilyTree[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<FamilyTree>> {
    return this.http.get<ApiResponse<FamilyTree>>(`${this.apiUrl}/${id}`);
  }

  create(familyTree: Partial<FamilyTree>): Observable<ApiResponse<FamilyTree>> {
    return this.http.post<ApiResponse<FamilyTree>>(this.apiUrl, familyTree);
  }

  update(id: number, familyTree: Partial<FamilyTree>): Observable<ApiResponse<FamilyTree>> {
    return this.http.put<ApiResponse<FamilyTree>>(`${this.apiUrl}/${id}`, familyTree);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}


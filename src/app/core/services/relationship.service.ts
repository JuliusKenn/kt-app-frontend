import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './family-tree.service';
import { Person } from './person.service';

export interface Relationship {
  id: number;
  person_id: number;
  related_person_id: number;
  relationship_type: 'parent' | 'child' | 'spouse';
  person?: Person;
  related_person?: Person;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RelationshipService {
  private apiUrl = `${environment.apiUrl}/relationships`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Relationship[]>> {
    return this.http.get<ApiResponse<Relationship[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Relationship>> {
    return this.http.get<ApiResponse<Relationship>>(`${this.apiUrl}/${id}`);
  }

  getByPerson(personId: number): Observable<ApiResponse<Relationship[]>> {
    return this.http.get<ApiResponse<Relationship[]>>(`${this.apiUrl}/person/${personId}`);
  }

  create(relationship: Partial<Relationship>): Observable<ApiResponse<Relationship>> {
    return this.http.post<ApiResponse<Relationship>>(this.apiUrl, relationship);
  }

  update(id: number, relationship: Partial<Relationship>): Observable<ApiResponse<Relationship>> {
    return this.http.put<ApiResponse<Relationship>>(`${this.apiUrl}/${id}`, relationship);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}


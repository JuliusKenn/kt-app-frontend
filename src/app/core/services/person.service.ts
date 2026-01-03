import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './family-tree.service';

export interface Person {
  id: number;
  family_tree_id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth?: string;
  date_of_death?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = `${environment.apiUrl}/people`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Person[]>> {
    return this.http.get<ApiResponse<Person[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponse<Person>> {
    return this.http.get<ApiResponse<Person>>(`${this.apiUrl}/${id}`);
  }

  getByFamilyTree(familyTreeId: number): Observable<ApiResponse<Person[]>> {
    return this.http.get<ApiResponse<Person[]>>(`${this.apiUrl}/family-tree/${familyTreeId}`);
  }

  create(person: Partial<Person>): Observable<ApiResponse<Person>> {
    return this.http.post<ApiResponse<Person>>(this.apiUrl, person);
  }

  update(id: number, person: Partial<Person>): Observable<ApiResponse<Person>> {
    return this.http.put<ApiResponse<Person>>(`${this.apiUrl}/${id}`, person);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}


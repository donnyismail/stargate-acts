import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  GetPeopleResponse,
  GetPersonByNameResponse,
  GetAstronautDutiesResponse,
  CreatePersonResponse,
  CreateAstronautDutyResponse,
  CreateAstronautDutyRequest
} from '../models/astronaut.models';

@Injectable({
  providedIn: 'root'
})
export class AstronautService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET /Person - Get all people
  getPeople(): Observable<GetPeopleResponse> {
    return this.http.get<GetPeopleResponse>(`${this.apiUrl}/Person`);
  }

  // GET /Person/{name} - Get person by name
  getPersonByName(name: string): Observable<GetPersonByNameResponse> {
    return this.http.get<GetPersonByNameResponse>(`${this.apiUrl}/Person/${encodeURIComponent(name)}`);
  }

  // GET /AstronautDuty/{name} - Get astronaut duties by name
  getAstronautDuties(name: string): Observable<GetAstronautDutiesResponse> {
    const url = `${this.apiUrl}/AstronautDuty/${encodeURIComponent(name)}`;
    console.log('Fetching astronaut duties from:', url);
    return this.http.get<GetAstronautDutiesResponse>(url);
  }

  // POST /Person - Create a new person
  createPerson(name: string): Observable<CreatePersonResponse> {
    return this.http.post<CreatePersonResponse>(`${this.apiUrl}/Person`, JSON.stringify(name), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST /AstronautDuty - Create a new astronaut duty
  createAstronautDuty(duty: CreateAstronautDutyRequest): Observable<CreateAstronautDutyResponse> {
    return this.http.post<CreateAstronautDutyResponse>(`${this.apiUrl}/AstronautDuty`, duty);
  }
}

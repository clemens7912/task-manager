import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user';
import { BACKEND_URL } from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(name: string, email: string, password: string): Observable<any>{
    return this.http.post(BACKEND_URL+'/api/auth/register', {name, email, password});
  }

  login(email: string, password: string): Observable<User>{
    return this.http.post<User>(BACKEND_URL+'/api/auth/login', {email, password});
  }

  refreshSession(): Observable<any>{
    return this.http.get(BACKEND_URL+'/api/auth/refresh-session');
  }

  logout(): Observable<any>{
    return this.http.post(BACKEND_URL+'/api/auth/logout', {});
  }

  getUsers(user: string = '', limit: number = 10): Observable<User[]> {
    return this.http.get<User[]>(BACKEND_URL+`/api/auth/users?user=${user}&limit=${limit}`);
  }
}

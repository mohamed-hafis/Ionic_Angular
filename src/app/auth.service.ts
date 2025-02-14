import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:59107/api/auth'; // Adjust the URL based on your API
  private token: string | null = null;
  private loggedIn = true;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token');
    this.loggedIn = this.isAuthenticated();
    this.isLoggedInSubject.next(this.loggedIn);
  }

  // Login method
  login(userName: string, password: string): Observable<any> {
    const body = {userName, password };
    return this.http.post<any>(`${this.apiUrl}/Login`, body);
  }
  // Signup method
  signup(username: string, password: string, confirmpassword:string): Observable<any> {
    const body = {username,  password, confirmpassword};
    return this.http.post(`${this.apiUrl}/Signup`, body);
  }

  // Handle successful login
  handleLogin(response: any): void {
    console.log('API Response:', response);
    if (response.Token) {
      this.token = response.Token;
      localStorage.setItem('token', this.token!);
      this.loggedIn = true;
      this.isLoggedInSubject.next(true);
      this.router.navigate(['/home']);
    } else {
      console.error('Login response does not contain a token.');
    }
  }

  // Logout method
  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    if (!this.token) return false;

    try {
      const decodedToken = jwtDecode<JwtPayload>(this.token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp ? decodedToken.exp > currentTime : false;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }

  // Observable for login status
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Get the current token
  getToken(): string | null {
    return this.token;
  }
}

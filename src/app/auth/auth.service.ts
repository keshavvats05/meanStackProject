import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated!: boolean;
  private token!: any;
  private tokenTimer!: any;
  private userId!: any;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  private BACKEND_URL = `${environment.apiUrl}/user`

  getToken() {
    console.log(this.token);
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusLIstener() {
    return this.authStatusListener.asObservable();
  }

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post(`${this.BACKEND_URL}/signup`, authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      },
      error => {
        this.authStatusListener.next(false);
      }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, userId: string  }>(
        `${this.BACKEND_URL}/login`,
        authData
      )
      .subscribe((response) => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          console.log(expiresInDuration);
          this.isAuthenticated = true;
          console.log(response)
          this.userId= response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }
      ,
      error => {
        this.authStatusListener.next(false);
      }
      );
  }

  logout() {
    console.log('logout method');
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = ''
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation?.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      // if expiresIn > 0 that means the token isn't expired yet!
      this.token = authInformation?.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000); // converting from milisec to sec dividing
      this.authStatusListener.next(true);
    }
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private setAuthTimer(expiresInDuration: number) {
    console.log('setting timer: ' + expiresInDuration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}

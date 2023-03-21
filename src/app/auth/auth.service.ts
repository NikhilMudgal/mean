import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  isAuthenticated = false;
  private tokenTimer: any;
  constructor(private http:HttpClient, private router: Router) { }

  getToken() {
    return this.token
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  getisAuth() {
    return this.isAuthenticated;
  }

  createUser(email:string, password:string) {
    const authData: AuthData = {
      email,
      password: password
    }
    this.http.post("http://localhost:3000/api/user/signup", authData)
    .subscribe(response => {
      console.log(response)
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password: password
    }
    this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData).subscribe((response) => {
      console.log(response)
      this.token = response.token;
      if(this.token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true); 
        const expiresInDuration = response.expiresIn;
        console.log(expiresInDuration)
        this.tokenTimer = setTimeout(() => {
          this.logout()
        }, expiresInDuration *1000)
        this.router.navigate(['/'])
      }
    })
  }

  logout() {
    this.token = null;
    this.isAuthenticated =  false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login'])
    clearTimeout(this.tokenTimer)
  }

}

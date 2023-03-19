import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading=false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogin(form:NgForm) {
    if(form.invalid) {
      return;
    }
    const email = form?.value?.email;
    const password = form?.value?.password
    this.authService.login(email, password);
  }

}

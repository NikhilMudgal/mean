import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading=false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const email = form?.value?.email;
    const password = form?.value?.password
    this.authService.createUser(email, password);
  }

}

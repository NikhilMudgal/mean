import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading=false;
  private authStatusSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) =>{
      this.isLoading = false;
      console.log(authStatus)
    })
  }

  onSignup(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    const email = form?.value?.email;
    const password = form?.value?.password
    this.authService.createUser(email, password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }

}

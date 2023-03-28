import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading=false;
  private authStatusSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) =>{
      this.isLoading = false;
      console.log(authStatus)
    })
  }

  onLogin(form:NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    const email = form?.value?.email;
    const password = form?.value?.password
    this.authService.login(email, password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }

}

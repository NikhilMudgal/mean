import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  
  constructor(private authService: AuthService) {}
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getisAuth();
   this.authListenerSubs =  this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
    this.userIsAuthenticated = isAuthenticated;
   });
  }

  onLogout() {
    this.authService.logout();
  }

}

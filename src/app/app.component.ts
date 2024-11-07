import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { PopupRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  template: `<nav>
  <a routerLink="/">Home</a>
  <a *ngIf="isAuthenticated" routerLink="/profile">Profile</a>
  <button *ngIf="!isAuthenticated" (click)="login()">Login</button>
  <button *ngIf="isAuthenticated" (click)="logout()">Logout</button>
</nav>

<router-outlet></router-outlet>
`
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(private msalService: MsalService) {}

  ngOnInit() {
    // Check if there is an active account
    this.isAuthenticated = this.msalService.instance.getAllAccounts().length > 0;

    // Subscribe to authentication events to update the authentication state
    this.msalService.instance.addEventCallback((event) => {
      if (event.eventType === 'msal:loginSuccess') {
        this.isAuthenticated = true;
      } else if (event.eventType === 'msal:logoutSuccess') {
        this.isAuthenticated = false;
      }
    });
  }

  async login() {
    try {
      // Check if the instance is initialized
      if (!this.msalService.instance.getAllAccounts()) {
        await this.msalService.instance.initialize();
      }
      
      const loginRequest: PopupRequest = {
        scopes: ['User.Read']
      };
      
      this.msalService.loginPopup(loginRequest).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isAuthenticated = true;
        },
        error: (error) => console.error('Login failed:', error)
      });
    } catch (error) {
      console.error('Error during login initialization:', error);
    }
  }

  logout() {
    this.msalService.logoutPopup().subscribe({
      next: () => {
        this.isAuthenticated = false;
        console.log('Logged out');
      },
      error: (error) => console.error('Logout failed:', error)
    });
  }
}

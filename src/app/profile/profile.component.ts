import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  template: `
    <div *ngIf="profile">
      <h2>Welcome, {{ profile.displayName }}</h2>
      <p>Email: {{ profile.mail || profile.userPrincipalName }}</p>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile: any;

  constructor(private msalService: MsalService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://graph.microsoft.com/v1.0/me').subscribe({
      next: (profile) => (this.profile = profile),
      error: (error) => console.error('Error fetching profile', error)
    });
  }
}

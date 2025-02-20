import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent  {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage: string = '';
  adminUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'superadmin', password: 'superadmin123' }
  ];

  constructor(private router: Router) {}

  onSubmit() {
    const user = this.adminUsers.find(
      u => u.username === this.credentials.username && u.password === this.credentials.password
    );

    if (user) {
      this.errorMessage = '';
      this.router.navigate(['/Admin']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
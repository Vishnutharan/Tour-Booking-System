import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/AuthService';
import { LoginDto } from 'src/app/Model/auth.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials: LoginDto = {
    username: '',
    password: '',
  };
  errorMessage: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  // Handle login form submission
  onSubmit() {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.errorMessage =
          err.error || 'Login failed. Please check your credentials.';
      },
    });
  }

  // Navigation to registration page
  switchToRegister() {
    this.router.navigate(['/register']);
  }
}

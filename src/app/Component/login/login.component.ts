import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials } from 'src/app/Model/auth.models';
import { AuthService } from 'src/app/Service/AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    public authService: AuthService, 
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Login failed. Please check your credentials.';
      }
    });
  }

  switchToRegister() {
    this.router.navigate(['/register']);
  }
}
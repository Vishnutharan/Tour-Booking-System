import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from 'src/app/Service/auth.service';
import { LoginCredentials, LoginDto } from 'src/app/Model/auth.models';
import { RegisterComponent } from '../register/register.component';
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
    this.errorMessage = ''; // Reset error message

    this.authService.login(this.credentials).subscribe({
      next: () => {
        // Successful login
        this.router.navigate(['/home']); // Redirect to dashboard
      },
      error: (err) => {
        // Handle login error
        this.errorMessage = err.error || 'Login failed. Please check your credentials.';
      }
    });
  }

  switchToRegister() {
    this.router.navigate(['/register']);
  }
 public get isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginCredentials } from 'src/app/Model/auth.models';
import { AuthService } from 'src/app/Service/AuthService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    this.errorMessage = ''; 

    this.authService.register(this.credentials).subscribe({
      next: () => {
        // Successful registration, redirect to login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Registration failed.';
      }
    });
  }

  switchToLogin() {
    this.router.navigate(['/login']);
  }
}




//   registrationForm: FormGroup;

//   constructor(private fb: FormBuilder) {
//     this.registrationForm = this.fb.group({
//       firstName: ['', [Validators.required, Validators.minLength(2)]],
//       lastName: ['', [Validators.required, Validators.minLength(2)]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(8)]]
//     });
//   }
//   ngOnInit(): void {
//     throw new Error('Method not implemented.');
//   }

//   onSubmit() {
//     if (this.registrationForm.valid) {
//       console.log(this.registrationForm.value);
//       // Add registration logic here
//     }
//   }
// }
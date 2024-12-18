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
        // Remove the throw statement:
        // No initialization logic needed at the moment.
    }

    onSubmit() {
        this.errorMessage = '';

        this.authService.register(this.credentials).subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.errorMessage = err.error || 'Registration failed.'; // Better error handling
            }
        });
    }

    switchToLogin() {
        this.router.navigate(['/login']);
    }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Service/AuthService';

@Component({
  selector: 'app-sinhala',
  templateUrl: './sinhala.component.html',
  styleUrls: ['./sinhala.component.css'],
})
export class SinhalaComponent implements OnInit {
  reviewForm!: FormGroup;
  reviews: any[] = [];
  submitted = false;
  userForm!: FormGroup;
  imagePreview: string | null = null;

  personalFields = [
    { id: 'firstName', label: 'First Name', type: 'text', errorMessage: 'First name is required' },
    { id: 'lastName', label: 'Last Name', type: 'text', errorMessage: 'Last name is required' },
    { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', errorMessage: 'Date of birth is required' },
    { id: 'gender', label: 'Gender', type: 'select', placeholder: 'Select Gender', options: ['Male', 'Female', 'Other'], errorMessage: 'Gender is required' },
    { id: 'nationality', label: 'Nationality', type: 'text', errorMessage: 'Nationality is required' },
  ];

  contactFields = [
    { id: 'email', label: 'Email', type: 'email', errorMessage: 'Valid email is required' },
    { id: 'phone', label: 'Phone Number', type: 'tel', errorMessage: 'Valid phone number is required' },
    { id: 'street', label: 'Street Address', type: 'text', errorMessage: 'Street address is required' },
    { id: 'city', label: 'City', type: 'text', errorMessage: 'City is required' },
    { id: 'state', label: 'State', type: 'text', errorMessage: 'State is required' },
    { id: 'zipCode', label: 'ZIP Code', type: 'text', errorMessage: 'Valid ZIP code is required' },
    { id: 'country', label: 'Country', type: 'text', errorMessage: 'Country is required' },
  ];

  constructor(private formBuilder: FormBuilder,public  authService: AuthService  ) {}

  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required],
      userImage: [''],
      date: [new Date()],
    });

    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
      country: ['', Validators.required],
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.reviewForm.patchValue({
          userImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.reviewForm.valid) {
      const newReview = {
        ...this.reviewForm.value,
        date: new Date(),
      };
      this.reviews.unshift(newReview);
      this.reviewForm.reset({ rating: 0 });
      this.imagePreview = null;
      this.submitted = false;
    }
  }

  onUserSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  setRating(rating: number): void {
    this.reviewForm.get('rating')?.setValue(rating);
  }

  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  navigateToLogin(): void {
    console.log('Navigate to login');
  }

  get f() {
    return this.reviewForm.controls;
  }
}

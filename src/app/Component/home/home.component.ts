import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TravelService } from 'src/app/Service/travel.service';
import { Country } from 'src/app/Model/travel.models';
import { Router } from '@angular/router';
import { Review,TourPackage,} from 'src/app/Model/travel.models';
import { AuthService } from 'src/app/Service/AuthService';
import { UserService } from 'src/app/Service/UserService';
import { ReviewService } from 'src/app/Service/ReviewService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  reviewForm!: FormGroup;
  reviews: Review[] = [];
  submitted = false;
  submitError = false;
  countries: Country[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  tourPackageId = 1; // Replace with the actual tour package ID
  userForm: FormGroup;
  isLoggedIn: boolean = false;

  personalFields = [
    { id: 'firstName', label: 'First Name', type: 'text', errorMessage: 'First name is required' },
    { id: 'lastName', label: 'Last Name', type: 'text', errorMessage: 'Last name is required' },
    { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', errorMessage: 'Date of birth is required' },
    { id: 'gender',label: 'Gender',type: 'select',placeholder: 'Select Gender', options: ['Male', 'Female', 'Other'],errorMessage: 'Gender is required', },
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

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private travelService: TravelService,
    private router: Router,
    public  authService: AuthService,
    public userService:UserService,
    public reviewService: ReviewService
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
      country: ['', Validators.required],
    }),
    this.reviewForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1)]],
      reviewText: ['', Validators.required],
      userImage: [null]
    });
  }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: any) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
      this.fetchReviews();
    });

    this.reviewForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required],
      tourPackageId: [1],
      userImage: [''], 
      date: [new Date()], 
    });

    this.travelService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.reviewForm.patchValue({ userImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
  
  private getStoredReviews(): Review[] {
    const stored = localStorage.getItem('reviews');
    return stored ? JSON.parse(stored) : [];
  }

  private storeReviews(reviews: Review[]): void {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reviewForm.invalid) {
      return;
    }

    const review: Review = {
      ...this.reviewForm.value,
      tourPackageId: this.tourPackageId,
      date: new Date()
    };

    this.reviewService.submitReview(review).subscribe(
      (res) => {
        alert('Review submitted successfully!');
        this.reviews.push(res);
        this.reviewForm.reset();
        this.imagePreview = null;
        this.submitted = false;
      },
      (err) => {
        console.error('Error submitting review:', err);
      }
    );
  }

  fetchReviews(): void {
    this.reviewService.getReviews(this.tourPackageId).subscribe(
      (res) => {
        this.reviews = res;
      },
      (err) => {
        console.error('Error fetching reviews:', err);
      }
    );
  }

  private markFormFieldsAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      form.controls[key].markAsTouched();
    });
  }

  // user information
  onUserSubmit() {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe({
        next: () => alert('User added successfully!'),
        error: (error) => console.error('Error:', error),
      });
      console.log(this.userForm.value); // Handle valid form submission
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  // Rating
  setRating(star: number): void {
    this.reviewForm.patchValue({ rating: star });
  }

 getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  get f() {
    return this.reviewForm.controls;
  }
}

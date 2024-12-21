import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule,} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TravelService } from 'src/app/Service/travel.service';
import { Country } from 'src/app/Interface/travel.interface';
import { Router } from '@angular/router';
import { Review,Skill,SocialLink,TourPackage} from 'src/app/Interface/tourpack.interface';

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

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private travelService: TravelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: any) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });

    this.reviewForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required],
      tourPackageId: [1]
    });

    this.travelService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
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
    if (this.reviewForm.valid) {
      const newReview = this.reviewForm.value;
      this.reviews.unshift(newReview);
      this.storeReviews(this.reviews);
      this.reviewForm.reset({ tourPackageId: 1, rating: 0 });
      this.submitted = false;
    }
  }

  setRating(rating: number): void {
    this.reviewForm.get('rating')?.setValue(rating);
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  get f() {
    return this.reviewForm.controls;
  }

  navigateToCountryDetails(countryId: string): void {
    this.router.navigate(['/country', countryId]);
  }
}
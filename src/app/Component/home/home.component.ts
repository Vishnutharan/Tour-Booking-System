import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

// Interfaces
interface Review {
  id?: number;
  tourPackageId: number;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt?: Date;
}

interface Skill {
  icon: string;
  title: string;
  description: string;
}

interface SocialLink {
  icon: string;
  url: string;
}

interface TourPackage {
  id: number;
  title: string;
  description: string;
  src: string;
  category?: string;
  price?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
 
	 // Add these missing properties
	 reviewForm!: FormGroup;
	 topReviews: Review[] = [];
	 submitted = false;
	 submitError = false;

  // Skill Cards Data
  skills: Skill[] = [
    {
      icon: 'globe',
      title: 'Tour Planning',
      description:
        'Designing and organizing the best travel itineraries for unforgettable experiences.',
    },
    {
      icon: 'airplane',
      title: 'Flight Booking',
      description:
        'Helping travelers find the best flights with flexible options and competitive prices.',
    },
    {
      icon: 'hotel',
      title: 'Hotel Reservations',
      description:
        'Securing comfortable and affordable accommodations for every type of traveler.',
    },
    {
      icon: 'car',
      title: 'Car Rentals',
      description:
        'Offering convenient car rental options for smooth travels wherever you go.',
    },
    {
      icon: 'star',
      title: 'Customer Service',
      description:
        'Providing exceptional support and assistance to ensure a seamless travel experience.',
    },
    {
      icon: 'ticket',
      title: 'Booking Management',
      description:
        'Managing travel bookings, including tour packages, flights, and hotel reservations.',
    },
  ];

  // Social Links Data
  socialLinks: SocialLink[] = [
    {
      icon: 'github',
      url: 'https://github.com/your-profile',
    },
    {
      icon: 'linkedin',
      url: 'https://linkedin.com/in/your-profile',
    },
    {
      icon: 'twitter',
      url: 'https://twitter.com/your-handle',
    },
  ];

  // Tour Packages Data
  tourPackages: TourPackage[] = [
    {
      id: 1,
      title: 'Adventure Tour',
      description: 'Explore the world with exciting adventure packages.',
      src: '/assets/tourbook1.webp',
      category: 'Adventure',
      price: 999,
    },
    {
      id: 2,
      title: 'Beach Vacation',
      description: 'Relax on the most beautiful beaches around the world.',
      src: '/assets/tourbook2.webp',
      category: 'Leisure',
      price: 1299,
    },
    {
      id: 3,
      title: 'Mountain Expedition',
      description:
        'Conquer majestic mountains with expert guides and scenic views.',
      src: '/assets/tourbook3.webp',
      category: 'Adventure',
      price: 1499,
    },
    {
      id: 4,
      title: 'City Escape',
      description:
        'Discover the best city breaks with luxury accommodations and top attractions.',
      src: '/assets/tourbook4.webp',
      category: 'Urban',
      price: 899,
    },
    {
      id: 5,
      title: 'Wildlife Safari',
      description:
        'Go on an exhilarating wildlife safari and witness amazing animal species in their natural habitat.',
      src: '/assets/tourbook5.webp',
      category: 'Nature',
      price: 2199,
    },
    {
      id: 6,
      title: 'Tropical Getaway',
      description:
        'Experience the serenity of the tropics with pristine beaches and crystal-clear waters.',
      src: '/assets/tourbook6.webp',
      category: 'Leisure',
      price: 1599,
    },
    {
      id: 7,
      title: 'Cultural Expedition',
      description:
        'Immerse yourself in the rich culture and heritage of ancient cities and traditions.',
      src: '/assets/tourbook9.webp',
      category: 'Cultural',
      price: 1299,
    },
    {
      id: 8,
      title: 'Luxury Cruise',
      description:
        'Set sail on a luxurious cruise to exotic locations with all-inclusive amenities.',
      src: '/assets/tourbook10.webp',
      category: 'Luxury',
      price: 2999,
    },
  ];

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTopReviews();
  }

  // Form Initialization
  initForm(): void {
    this.reviewForm = this.formBuilder.group({
      customerName: ['', [Validators.required, Validators.maxLength(100)]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', [Validators.required, Validators.maxLength(1000)]],
      tourPackageId: [1], // Hardcoded for this example, should be dynamic
    });
  }

 // Load Top Reviews
  loadTopReviews(): void {
    this.http.get<Review[]>('api/Reviews/top/6').subscribe({
      next: (reviews) => {
        this.topReviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews', error);
      },
    });
  }


  // Submit Review
  // Submit Review
  onSubmit(): void {
    this.submitted = true;
    this.submitError = false;

    if (this.reviewForm.valid) {
      this.http.post('api/Reviews', this.reviewForm.value).subscribe({
        next: () => {
          this.loadTopReviews();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error submitting review', err);
          this.submitError = true;
        },
      });
    }
  }

  // Reset Form Method
  resetForm(): void {
    this.submitted = false;
    this.reviewForm.reset({
      tourPackageId: 1,
      rating: 0,
    });
  }

  // Rating Methods
  setRating(rating: number): void {
    const ratingControl = this.reviewForm.get('rating');
    if (ratingControl) {
      ratingControl.setValue(rating);
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  // Package Filtering and Selection
  onPackageClick(packageId: number): void {
    console.log(`Selected package with ID: ${packageId}`);
  }

  filterPackagesByCategory(category: string): TourPackage[] {
    return this.tourPackages.filter((pkg) => pkg.category === category);
  }

  // Convenience getter for easy access to form fields
  get f() { return this.reviewForm.controls; }
}
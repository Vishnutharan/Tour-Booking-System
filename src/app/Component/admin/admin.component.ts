import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingDetails } from 'src/app/Model/bookingdetails';
import { Country, Review, TouristPlace } from 'src/app/Model/travel.models';
import { UserInfo } from 'src/app/Model/UserInfo.models';
import { BookingService } from 'src/app/Service/BookingService';
import { ReviewService } from 'src/app/Service/ReviewService';
import { TravelService } from 'src/app/Service/travel.service';
import { UserService } from 'src/app/Service/UserService';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  currentSection: 'users' | 'bookings' | 'places' | 'countries' | 'reviews' = 'users';
  searchTerm: string = '';
  showEditModal: boolean = false;
  editingItem: any = null;
  editForm: FormGroup;
  editingUser: UserInfo | null = null;
  users: UserInfo[] = [];
  filteredUsers: UserInfo[] = [];
  userForm: FormGroup;

  // Data arrays
  bookings: BookingDetails[] = [];
  places: TouristPlace[] = [];
  countries: Country[] = [];
  reviews: Review[] = [];

  // Filtered arrays
  filteredBookings: BookingDetails[] = [];
  filteredPlaces: TouristPlace[] = [];
  filteredCountries: Country[] = [];
  filteredReviews: Review[] = [];

  constructor(
    private travelService: TravelService,
    private bookingService: BookingService,
    private userService: UserService,
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.editForm = this.createForm();
    this.userForm = this.createUserForm();
  }

  ngOnInit() {
    this.loadData();
    this.loadReviews();
    this.loadUsers();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfTravel: ['', Validators.required],
      numberOfPeople: [1, [Validators.required, Validators.min(1)]],
      totalAmount: [0, Validators.required],
      tax: [0, Validators.required],
      finalAmount: [0, Validators.required],
      customerName: [''],
      rating: [1],
      reviewText: [''],
    });
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      userId: [0],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],
    });
  }

  createReviewForm(): FormGroup {
    return this.fb.group({
      customerName: ['', Validators.required],
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required],
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (error) => console.error('Error loading users:', error),
    });
  }

  loadReviews() {
    this.reviewService.getReviews(1).subscribe({
      next: (data) => {
        this.reviews = data;
        this.filteredReviews = data;
      },
      error: (error) => console.error('Error loading reviews:', error),
    });
  }

  loadData() {
    this.bookingService.getUserBookings().subscribe((data) => {
      this.bookings = data;
      this.filteredBookings = data;
    });

    this.travelService.getCountries().subscribe((data) => {
      this.countries = data;
      this.filteredCountries = data;
    });

    if (this.countries.length > 0) {
      this.travelService
        .getTouristPlaces(this.countries[0].countryId)
        .subscribe((data) => {
          this.places = data;
          this.filteredPlaces = data;
        });
    }
  }

  setSection(
    section: 'users' | 'bookings' | 'places' | 'countries' | 'reviews'
  ) {
    this.currentSection = section;
    this.onSearch();
    if (section === 'reviews' && !this.editForm) {
      this.editForm = this.createReviewForm();
    }
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();

    if (this.currentSection === 'bookings') {
      this.filteredBookings = this.bookings.filter(
        (booking) =>
          booking.name?.toLowerCase().includes(term) ||
          booking.id?.toString().includes(term)
      );
    } else if (this.currentSection === 'reviews') {
      this.filteredReviews = this.reviews.filter(
        (review) =>
          review.customerName.toLowerCase().includes(term) ||
          review.reviewText.toLowerCase().includes(term)
      );}
      else if  (this.currentSection === 'users') {
        this.filteredUsers = this.users.filter(
          (user) => user.firstName.toLowerCase().includes(term) || user.lastName.toLowerCase().includes(term)
        );
      }
    }

  showAddUserForm() {
    this.editingUser = null;
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showEditModal = true;
  }

  showAddReviewForm() {
    this.editingItem = null;
    this.editForm.reset();
    this.showEditModal = true;
  }

  saveChanges() {
    if (!this.editForm.valid) {
      return; // Don't proceed if the form is invalid
    }

    const formData = this.editForm.value;

    if (this.currentSection === 'reviews') {
      if (this.editingItem) {
        // Update existing review
        const updatedReview: Review = {
          ...this.editingItem,
          ...formData,
        };

        this.reviewService
          .updateReview(updatedReview.id, updatedReview)
          .subscribe({
            next: () => {
              // Update the review in the local arrays
              const index = this.reviews.findIndex(
                (r) => r.id === updatedReview.id
              );
              if (index > -1) {
                this.reviews[index] = updatedReview;
              }
              this.filteredReviews = [...this.reviews];
              this.closeModal();
            },
            error: (error) => console.error('Error updating review:', error),
          });
      } else {
        // Create new review
        this.reviewService.submitReview(formData).subscribe({
          next: (newReview) => {
            this.reviews.push(newReview);
            this.filteredReviews = [...this.reviews];
            this.closeModal();
          },
          error: (error) => console.error('Error creating review:', error),
        });
      }
    } else if (this.currentSection === 'bookings') {
      // Similar logic for bookings (update or create)
      if (this.editingItem) {
        // Update existing booking
        const updatedBooking: BookingDetails = {
          ...this.editingItem,
          ...formData,
        };

        this.bookingService
          .updateBooking(updatedBooking.id!, updatedBooking)
          .subscribe({
            next: () => {
              const index = this.bookings.findIndex(
                (b) => b.id === updatedBooking.id
              );
              if (index !== -1) {
                this.bookings[index] = updatedBooking;
              }
              this.filteredBookings = [...this.bookings];
              this.closeModal();
            },
            error: (err) => {
              console.error('Error updating booking:', err);
            },
          });
      } else {
        // Create new booking
        this.bookingService.createBooking(formData).subscribe({
          next: (newBooking) => {
            this.bookings.push(newBooking);
            this.filteredBookings = [...this.bookings];
            this.closeModal();
          },
          error: (error) => console.error('Error creating booking:', error),
        });
      }
    }
  }

  closeModal() {
    this.showEditModal = false;
    this.editingItem = null;
    this.editForm.reset();
  }

  editReview(review: Review | null) {
    this.currentSection = 'reviews';
    this.editingItem = review;
    this.showEditModal = true;

    if (review) {
      if (!this.editForm) {
        this.editForm = this.createReviewForm();
      }
      this.editForm.patchValue({
        customerName: review.customerName,
        rating: review.rating,
        reviewText: review.reviewText,
      });
    } else {
      // Reset the form for adding a new review
      this.editForm.reset({
        customerName: '',
        rating: 1,
        reviewText: '',
      });
    }
  }

  editBooking(booking: BookingDetails | null) {
    this.currentSection = 'bookings';
    this.editingItem = booking;
    this.showEditModal = true;

    if (booking) {
      if (!this.editForm) {
        this.editForm = this.createForm();
      }
      this.editForm.patchValue({
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        dateOfTravel: booking.dateOfTravel,
        numberOfPeople: booking.numberOfPeople,
        totalAmount: booking.totalAmount,
        tax: booking.tax,
        finalAmount: booking.finalAmount,
      });
    } else {
      // Reset form for adding a new booking
      this.editForm.reset({
        name: '',
        email: '',
        phone: '',
        dateOfTravel: '',
        numberOfPeople: 1,
        totalAmount: 0,
        tax: 0,
        finalAmount: 0,
      });
    }
  }

  deleteReview(review: Review) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(review.id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter((r) => r.id !== review.id);
          this.filteredReviews = [...this.reviews];
        },
        error: (error) => console.error('Delete error:', error),
      });
    }
  }

  deleteBooking(booking: BookingDetails) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(booking.id!).subscribe({
        next: () => {
          this.bookings = this.bookings.filter((b) => b.id !== booking.id);
          this.filteredBookings = this.filteredBookings.filter(
            (b) => b.id !== booking.id
          );
        },
        error: (err) => console.error('Delete failed:', err),
      });
    }
  }

  saveReviewChanges() {
    if (!this.editForm.valid) {
      return; // Don't proceed if the form is invalid
    }

    const formData = this.editForm.value;

    if (this.editingItem) {
      // Update existing review
      const updatedReview: Review = {
        ...this.editingItem,
        ...formData,
      };

      this.reviewService
        .updateReview(updatedReview.id, updatedReview)
        .subscribe({
          next: () => {
            const index = this.reviews.findIndex(
              (r) => r.id === updatedReview.id
            );
            if (index > -1) {
              this.reviews[index] = updatedReview;
            }
            this.filteredReviews = [...this.reviews];
            this.closeModal();
          },
          error: (error) => console.error('Error updating review:', error),
        });
    } else {
      // Create new review
      this.reviewService.submitReview(formData).subscribe({
        next: (newReview) => {
          this.reviews.push(newReview);
          this.filteredReviews = [...this.reviews];
          this.closeModal();
        },
        error: (error) => console.error('Error creating review:', error),
      });
    }
  }
  

  saveUserChanges() {
    if (!this.editForm.valid) {
      return; // Don't proceed if the form is invalid
    }

    const formData = this.editForm.value;

    if (this.editingUser) {
      // Update existing user
      const updatedUser: UserInfo = { ...this.editingUser, ...formData };
      this.userService.updateUser(updatedUser.userId, updatedUser).subscribe({
        next: () => {
          const index = this.users.findIndex(
            (u) => u.userId === updatedUser.userId
          );
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.filteredUsers = [...this.users];
          this.closeModal();
        },
        error: (error) => console.error('Error updating user:', error),
      });
    } else {
      // Add new user
      this.userService.addUser(formData).subscribe({
        next: (response) => {
          console.log(response.message);
          this.users.push(formData);
          this.filteredUsers = [...this.users];
          this.closeModal();
        },
        error: (error) => console.error('Error adding user:', error),
      });
    }
  }

  editUser(user: UserInfo) {
    this.editingUser = user;
    this.editForm.patchValue(user);
    this.showEditModal = true;
  }

  deleteUser(user: UserInfo) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.userId !== user.userId);
          this.filteredUsers = [...this.users];
        },
        error: (error) => console.error('Delete error:', error),
      });
    }
  }
}

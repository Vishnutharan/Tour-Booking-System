// admin.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingDetails } from 'src/app/Model/bookingdetails';
import { Coupon } from 'src/app/Model/coupon.models';
import { Country, Review, TouristPlace, TouristPlaceBackend } from 'src/app/Model/travel.models';
import { UserInfo } from 'src/app/Model/UserInfo.models';
import { BookingService } from 'src/app/Service/BookingService';
import { CountryService } from 'src/app/Service/CountryService';
import { CouponService } from 'src/app/Service/CouponService';
import { ReviewService } from 'src/app/Service/ReviewService';
import { TouristPlaceService } from 'src/app/Service/TouristPlaceService';
import { TravelService } from 'src/app/Service/travel.service';
import { UserService } from 'src/app/Service/UserService';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
    // Properties
    currentSection:
        | 'users'
        | 'bookings'
        | 'places'
        | 'countries'
        | 'reviews'
        | 'coupons' = 'users';
    searchTerm: string = '';
    showEditModal: boolean = false;
    editingItem: any = null;
    editForm: FormGroup; // Generic form for bookings/reviews
    users: UserInfo[] = [];
    filteredUsers: UserInfo[] = [];
    userForm: FormGroup; // Dedicated form for users

    // Data arrays
    bookings: BookingDetails[] = [];
    places: TouristPlaceBackend[] = [];  // Use the correct type
    countries: Country[] = [];
    reviews: Review[] = [];
    coupons: Coupon[] = [];
    country: Country = { CountryId: '', name: '', description: '', imageUrl: '', featuredScore: 0 };

    // Filtered arrays
    filteredBookings: BookingDetails[] = [];
    filteredPlaces: TouristPlaceBackend[] = []; // Use the correct type
    filteredCountries: Country[] = [];
    filteredReviews: Review[] = [];
    filteredCoupons: Coupon[] = [];

    // Coupon related properties
    couponForm: FormGroup;
    couponCode: string = '';
    appliedCoupon: Coupon | null = null;
    discountedAmount: number = 0;
    editingUser: UserInfo | null = null;

    //tourist place form
    placeForm: FormGroup;
    isAddingPlace = false;
    isEditingPlace = false;

    constructor(
        private travelService: TravelService,
        private bookingService: BookingService,
        private userService: UserService,
        private fb: FormBuilder,
        private reviewService: ReviewService,
        private couponService: CouponService,
        private countryService: CountryService,
        private touristPlaceService: TouristPlaceService // Inject TouristPlaceService
    ) {
        this.editForm = this.createEditForm();
        this.userForm = this.createUserForm();
        this.couponForm = this.createCouponForm();
        this.placeForm = this.createPlaceForm();
    }

    ngOnInit() {
        this.loadData();
        this.loadUsers();
        this.loadCoupons();
        this.loadReviews();
        this.getCountries();
        this.loadPlaces();

    }

    getCountries(): void {
        this.countryService.getCountries().subscribe(countries => {
          this.countries = countries;
          this.filteredCountries = countries;  // Also update filtered list
        });
      }

    getCountry(id: string): void {
        this.countryService.getCountry(id).subscribe(country => this.country = country);
    }

    createCountry(): void {
        this.countryService.createCountry(this.country).subscribe(() => this.getCountries());
    }

    updateCountry(): void {
        this.countryService.updateCountry(this.country.CountryId, this.country).subscribe(() => this.getCountries());
    }

    deleteCountry(id: string): void {
        this.countryService.deleteCountry(id).subscribe(() => this.getCountries());
    }
    editCountry(country: Country): void {
        this.country = { ...country }; // Create a copy to avoid modifying the original until saved.
        this.openModal();
      }
      


    // -------------------------- Form Creation Methods --------------------------

    createEditForm(): FormGroup {
        return this.fb.group({
            // Booking properties
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
            country: ['']
        });
    }

    createCouponForm(): FormGroup {
        return this.fb.group({
            code: ['', [Validators.required, Validators.minLength(5)]],
            discountPercentage: [
                '',
                [Validators.required, Validators.min(0), Validators.max(100)],
            ],
            expiryDate: ['', Validators.required],
            minimumAmount: [0, Validators.min(0)],
            maximumDiscount: [0, Validators.min(0)],
            usageLimit: [0, Validators.min(0)],
            isActive: [true],
        });
    }

    createPlaceForm(): FormGroup {
        return this.fb.group({
            placeName: ['', Validators.required],
            countryId: ['', Validators.required],
            description: [''],
            imageUrl: [''],
            cost: [0, Validators.required],
            rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
            highlights: [[]],
            bestTimeToVisit: [''],
            duration: [''],
            hotelName: [''],
            roomType: [''],
            specialRequests: [''],
            checkInDate: [null],
            checkOutDate: [null],
            numberOfRooms: [null],
            occupancyDetails: [''],
            transportationMode: [''],
            travelDuration: [''],
            travelCost: [null],
            guideName: ['', Validators.required],
            experience: ['', Validators.required],
            languagesSpoken: [[]],
            contactNumber: ['', Validators.required],
            specialization: [[]]
        });
      }

    // -------------------------- Data Loading Methods --------------------------

    loadData() {
        this.bookingService.getUserBookings().subscribe((data) => {
            this.bookings = data;
            this.filteredBookings = data;
        });

        this.travelService.getCountries().subscribe((data) => {
            this.countries = data;
            this.filteredCountries = data;
        });

        // if (this.countries.length > 0) {
        //  this.travelService
        //      .getTouristPlaces(this.countries[0].CountryId)
        //   .subscribe((data) => {  //Removed the parameter from getTouristPlaces.
        //    this.places = data;
        //    this.filteredPlaces = data;
        //        });
        // }
        this.loadPlaces(); // Load places
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

    loadCoupons() {
        this.couponService.getCoupons().subscribe({
            next: (coupons) => {
                this.coupons = coupons;
                this.filteredCoupons = coupons;
            },
            error: (error) => console.error('Error loading coupons:', error),
        });
    }
    loadPlaces(): void {
        this.touristPlaceService.getTouristPlaces()
          .subscribe(places => {
            this.places = places;
            this.filteredPlaces = places; // Update filtered places
          });
      }

    // -------------------------- Section Management Methods --------------------------

    setSection(
        section: 'users' | 'bookings' | 'places' | 'countries' | 'reviews' | 'coupons'
    ) {
        this.currentSection = section;
        this.onSearch(); // Apply search filter when changing section
    }

    // -------------------------- Search Functionality --------------------------

    onSearch() {
        const term = this.searchTerm.toLowerCase();

        switch (this.currentSection) {
            case 'bookings':
                this.filteredBookings = this.bookings.filter(
                    (booking) =>
                        booking.name?.toLowerCase().includes(term) ||
                        booking.id?.toString().includes(term)
                );
                break;
            case 'reviews':
                this.filteredReviews = this.reviews.filter(
                    (review) =>
                        review.customerName.toLowerCase().includes(term) ||
                        review.reviewText.toLowerCase().includes(term)
                );
                break;
            case 'users':
                this.filteredUsers = this.users.filter(
                    (user) =>
                        user.firstName.toLowerCase().includes(term) ||
                        user.lastName.toLowerCase().includes(term) ||
                        user.username.toLowerCase().includes(term) ||  // Added username search
                        user.email.toLowerCase().includes(term)       // Added email search
                );
                break;
            case 'coupons':
                this.filteredCoupons = this.coupons.filter((coupon) =>
                    coupon.code.toLowerCase().includes(term)
                );
                break;
            case 'countries':
                this.filteredCountries = this.countries.filter(
                    (country) =>
                    country.name.toLowerCase().includes(term) ||
                    country.description.toLowerCase().includes(term)
                );
                break;
            case 'places':
                this.filteredPlaces = this.places.filter(
                    (place) =>
                    place.placeName.toLowerCase().includes(term) ||
                    place.description?.toLowerCase().includes(term) || false
                   );
                break;

            default:
                break;
        }
    }

    // -------------------------- Modal & Form Management Methods --------------------------

    openModal() {
        this.showEditModal = true;
    }

    closeModal() {
        this.showEditModal = false;
        this.editingItem = null;
        this.editForm.reset();
        this.couponForm.reset();
        this.userForm.reset(); // Reset user form
        this.placeForm.reset();
        this.isAddingPlace = false;
        this.isEditingPlace = false;
    }

    // -------------------------- User Management Methods --------------------------

    showAddUserForm() {
        this.editingUser = null;
        this.userForm.reset();
        this.openModal();
    }

    editUser(user: UserInfo) {
        this.editingUser = { ...user }; // Create a copy to avoid modifying the original until saved.
        this.userForm.patchValue(this.editingUser);
        this.currentSection = 'users';
        this.openModal();
    }

    saveUserChanges() {
        if (!this.userForm.valid) {
            return;
        }

        const formData = this.userForm.value;

        if (this.editingUser) {
            // Update existing user
            const updatedUser: UserInfo = { ...this.editingUser, ...formData };
            this.userService.updateUser(updatedUser.userId, updatedUser).subscribe({
                next: () => {
                    // Update the local user list
                    const index = this.users.findIndex((u) => u.userId === updatedUser.userId);
                    if (index !== -1) {
                        this.users[index] = updatedUser;
                    }
                    this.filteredUsers = [...this.users]; // Update filtered list
                    this.closeModal();
                },
                error: (error) => console.error('Error updating user:', error),
            });
        } else {
            // Add new user
            this.userService.addUser(formData).subscribe({
                next: (newUser: UserInfo) => { // Expect the new user from the response
                    this.users.push(newUser);
                    this.filteredUsers = [...this.users]; // Update filtered list
                    this.closeModal();
                },
                error: (error) => console.error('Error adding user:', error),
            });
        }
    }

    deleteUser(user: UserInfo) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.userService.deleteUser(user.userId).subscribe({
                next: () => {
                    this.users = this.users.filter((u) => u.userId !== user.userId);
                    this.filteredUsers = [...this.users]; // Update filtered list
                },
                error: (error) => console.error('Delete error:', error),
            });
        }
    }

    // -------------------------- Booking Management Methods --------------------------

    editBooking(booking: BookingDetails | null) {
        this.editingItem = booking;
        this.currentSection = 'bookings';
        this.openModal();

        if (booking) {
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
            this.editForm.reset();
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

    // -------------------------- Review Management Methods --------------------------

    editReview(review: Review | null) {
        this.editingItem = review;
        this.currentSection = 'reviews';
        this.openModal();

        if (review) {
            this.editForm.patchValue({
                customerName: review.customerName,
                rating: review.rating,
                reviewText: review.reviewText,
            });
        } else {
            this.editForm.reset();
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

    // -------------------------- Coupon Management Methods --------------------------

    showAddCouponForm() {
        this.editingItem = null;
        this.couponForm.reset({
            isActive: true,
            discountPercentage: 0,
            minimumAmount: 0,
            maximumDiscount: 0,
            usageLimit: 0,
        });
        this.openModal();
        this.currentSection = 'coupons';
    }

    editCoupon(coupon: Coupon) {
        this.editingItem = coupon;
        this.couponForm.patchValue({
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
            expiryDate: coupon.expiryDate,
            minimumAmount: coupon.minimumAmount,
            maximumDiscount: coupon.maximumDiscount,
            usageLimit: coupon.usageLimit,
            isActive: coupon.isActive,
        });
        this.openModal();
        this.currentSection = 'coupons';
    }

    deleteCoupon(coupon: Coupon) {
        if (confirm('Are you sure you want to delete this coupon?')) {
            this.couponService.deleteCoupon(coupon.id).subscribe({
                next: () => {
                    this.coupons = this.coupons.filter((c) => c.id !== coupon.id);
                    this.filteredCoupons = [...this.coupons];
                },
                error: (error) => console.error('Error deleting coupon:', error),
            });
        }
    }

    saveCouponChanges() {
        if (!this.couponForm.valid) {
            return;
        }

        const formData = this.couponForm.value;

        if (this.editingItem) {
            const updatedCoupon: Coupon = {
                ...this.editingItem,
                ...formData,
            };

            this.couponService
                .updateCoupon(updatedCoupon.id, updatedCoupon)
                .subscribe({
                    next: () => {
                        const index = this.coupons.findIndex(
                            (c) => c.id === updatedCoupon.id
                        );
                        if (index !== -1) {
                            this.coupons[index] = updatedCoupon;
                        }
                        this.filteredCoupons = [...this.coupons];
                        this.closeModal();
                    },
                    error: (error) => console.error('Error updating coupon:', error),
                });
        } else {
            this.couponService.createCoupon(formData).subscribe({
                next: (newCoupon) => {
                    this.coupons.push(newCoupon);
                    this.filteredCoupons = [...this.coupons];
                    this.closeModal();
                },
                error: (error) => console.error('Error creating coupon:', error),
            });
        }
    }

    applyCoupon() {
        if (!this.couponCode) return;

        const currentAmount = this.editForm.get('totalAmount')?.value || 0;

        this.couponService
            .validateCoupon(this.couponCode, currentAmount)
            .subscribe({
                next: (coupon) => {
                    this.appliedCoupon = coupon;
                    this.discountedAmount = this.calculateDiscount(coupon);

                    const finalAmount = currentAmount - this.discountedAmount;
                    this.editForm.patchValue({
                        finalAmount: finalAmount,
                    });
                },
                error: (error) => {
                    console.error('Error applying coupon:', error);
                    this.appliedCoupon = null;
                    this.discountedAmount = 0;
                },
            });
    }

    private calculateDiscount(coupon: Coupon): number {
        const currentAmount = this.editForm.get('totalAmount')?.value || 0;

        if (currentAmount < coupon.minimumAmount) {
            return 0;
        }

        const discountAmount = (currentAmount * coupon.discountPercentage) / 100;

        if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
            return coupon.maximumDiscount;
        }

        return discountAmount;
    }

    // -------------------------- Generic Save Changes Method --------------------------

    saveChanges() {
        if (!this.editForm.valid) {
            return;
        }

        const formData = this.editForm.value;

        switch (this.currentSection) {
            case 'bookings':
                this.saveBookingChanges(formData);
                break;
            case 'reviews':
                this.saveReviewChanges(formData);
                break;
            default:
                break;
        }
    }
    private saveBookingChanges(formData: any) {
        if (this.editingItem) {
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

    private saveReviewChanges(formData: any) {
        if (this.editingItem) {
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

    //--------------Tourist place CURD Operation--------------------

    showAddPlaceForm() {
        this.isAddingPlace = true;
        this.placeForm.reset({
            cost: 0,
            rating: 1,
            highlights: [],
            languagesSpoken: [],
            specialization: []
        });
        this.setSection('places');  // Switch to the places section
        this.openModal();       // Open the modal
    }


    editPlace(place: TouristPlaceBackend) {
        this.isEditingPlace = true;
        this.editingItem = place.placeId; // Corrected line
        this.placeForm.patchValue(place);
        this.setSection('places'); // Switch to places section
        this.openModal();          // Open the modal
    }


    deletePlace(place: TouristPlaceBackend) {
      if (confirm('Are you sure you want to delete this place?')) {
          this.touristPlaceService.deleteTouristPlace(place.placeId).subscribe({
              next: () => {
                  this.places = this.places.filter(p => p.placeId !== place.placeId);
                  this.filteredPlaces = [...this.places];
              },
              error: error => console.error("Error deleting place:", error)
          });
      }
  }
    savePlaceChanges() {

        if (this.placeForm.invalid) {
          return;
        }
    
        if (this.isEditingPlace && this.editingItem) {
          // Edit existing place
          this.touristPlaceService.updateTouristPlace(this.editingItem, this.placeForm.value)
            .subscribe(() => {
              this.loadPlaces();
              this.closeModal();
            });
        } else {
          // Add new place
          this.touristPlaceService.createTouristPlace(this.placeForm.value)
            .subscribe(() => {
              this.loadPlaces();
              this.closeModal();
            });
        }
      }
      updatePlaceArray(event: any, controlName: string): void {
        const value = event.target.value;
        const array = value ? value.split(',').map((item: string) => item.trim()) : [];
        this.placeForm.get(controlName)?.setValue(array);
    }

    onPlaceFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
          this.touristPlaceService.uploadImage(file)
            .subscribe(url => {
                // Prepend the base URL to the returned path.
                this.placeForm.patchValue({ imageUrl: `http://localhost:4200/${url}` });
            });
        }
      }


}
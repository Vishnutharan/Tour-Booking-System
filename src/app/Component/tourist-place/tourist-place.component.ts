import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { TouristPlace, TouristPlaceBackend } from 'src/app/Model/travel.models';
import { TouristPlaceService } from 'src/app/Service/TouristPlaceService';

@Component({
  selector: 'app-tourist-place',
  templateUrl: './tourist-place.component.html',
  styleUrls: ['./tourist-place.component.css']
})
export class TouristPlaceComponent implements OnInit {
  places: TouristPlaceBackend[] = [];
  form!: FormGroup;
  isEditing = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private touristPlaceService: TouristPlaceService

  ) {
    this.createForm();
  }

  
  ngOnInit(): void {
    this.loadPlaces();
  }

  createForm(): void {
    this.form = this.fb.group({
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

   loadPlaces(): void {
    this.touristPlaceService.getTouristPlaces()
      .subscribe(places => this.places = places);
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.touristPlaceService.uploadImage(file)
        .subscribe(url => {
          this.form.patchValue({ imageUrl: `http://localhost:4200/${url}` }); // Ensure it's a valid path
        });
    }
  }

  updateArray(event: any, controlName: string): void {
    const value = event.target.value;
    const array = value ? value.split(',').map((item: string) => item.trim()) : [];
    this.form.get(controlName)?.setValue(array);
  }

  startAdd(): void {
    this.isEditing = true;
    this.editingId = null;
    this.form.reset({
      cost: 0,
      rating: 1,
      highlights: [],
      languagesSpoken: [],
      specialization: []
    });
  }

  startEdit(place: TouristPlaceBackend): void {
    this.isEditing = true;
    this.editingId = place.placeId;
    this.form.patchValue(place);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingId = null;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const placeData = this.form.value;
      
      if (this.editingId) {
        this.touristPlaceService.updateTouristPlace(this.editingId, placeData)
          .subscribe(() => {
            this.loadPlaces();
            this.cancelEdit();
          });
      } else {
        this.touristPlaceService.createTouristPlace(placeData)
          .subscribe(() => {
            this.loadPlaces();
            this.cancelEdit();
          });
      }
    }
  }
  deletePlace(id: number): void {
    if (confirm('Are you sure you want to delete this place?')) {
      this.http.delete(`api/TouristPlaces/${id}`)
        .subscribe(() => this.loadPlaces());
    }
  }
}
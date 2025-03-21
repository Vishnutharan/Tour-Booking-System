import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecommendationService } from 'src/app/Service/Recommendation.service';

@Component({
  selector: 'app-recomdation',
  templateUrl: './recomdation.component.html',
  styleUrls: ['./recomdation.component.css'],
})
export class RecomdationComponent implements OnInit {
  recommendationForm: FormGroup;
  recommendation: any = null;
  loading = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,

    private recommendationService: RecommendationService
  ) {
    this.recommendationForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {}

  getRecommendation(): void {
    if (this.recommendationForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.recommendation = null;

    const { age, rating } = this.recommendationForm.value;

    this.recommendationService.getRecommendation(age, rating).subscribe({
      next: (res) => {
        this.recommendation = res;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          err.error.error || 'An error occurred while fetching recommendation.';
        this.loading = false;
      },
    });
  }

  getConfidenceColor(confidence: number): string {
    if (confidence > 0.8) return 'green';
    if (confidence > 0.6) return 'lightgreen';
    if (confidence > 0.4) return 'orange';
    return 'red';
  }

  getTopReviews(topReviews: any[]): any[] {
    return topReviews.sort((a, b) => b.count - a.count).slice(0, 3);
  }

  resetForm(): void {
    this.recommendationForm.reset({
      age: '',
      rating: 5,
    });
    this.recommendation = null;
    this.error = '';
  }
  goToRecommendation(): void {
    this.router.navigate(['/recommend']);
  }

  goToStatistics(): void {
    this.router.navigate(['/statistics']);
  }
}

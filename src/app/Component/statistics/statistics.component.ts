import { Component, OnInit } from '@angular/core';
import { RecommendationService } from 'src/app/Service/Recommendation.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  statistics: any = null;
  loading = true;
  error = '';

  constructor(private recommendationService: RecommendationService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.recommendationService.getStatistics()
      .subscribe({
        next: (res) => {
          this.statistics = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error.error || 'An error occurred while fetching statistics.';
          this.loading = false;
        }
      });
  }

  getTopPlacesByAgeGroup(ageGroup: string): any[] {
    if (!this.statistics || !this.statistics.age_groups[ageGroup]) {
      return [];
    }

    const places = this.statistics.age_groups[ageGroup];
    return Object.entries(places)
      .map(([place, count]) => ({ place, count }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 3);
  }

  getPlaceStats(): any[] {
    if (!this.statistics || !this.statistics.place_stats) {
      return [];
    }
    return this.statistics.place_stats;
  }

  getMaxPlaceCount(): number {
    if (!this.statistics || !this.statistics.place_stats) {
      return 1;
    }
    return Math.max(...this.statistics.place_stats.map((place: any) => place.count));
  }

  getRatingStats(): any[] {
    if (!this.statistics || !this.statistics.rating_stats) {
      return [];
    }
    return this.statistics.rating_stats;
  }

  getMaxRatingCount(): number {
    if (!this.statistics || !this.statistics.rating_stats) {
      return 1;
    }
    return Math.max(...this.statistics.rating_stats.map((item: any) => item.count));
  }
}

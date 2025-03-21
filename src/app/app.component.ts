import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { AuthService } from './Service/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'Tour-Booking-System';
  showLogoutDropdown = false;
  isMenuOpen = false; // Declare the isMenuOpen property

  @ViewChild('menuToggle') menuToggle!: ElementRef;
  @ViewChild('navLinks') navLinks!: ElementRef;

  constructor(
    public authService: AuthService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngAfterViewInit() {
    if (this.menuToggle && this.navLinks) {
      this.renderer.listen(this.menuToggle.nativeElement, 'click', () => {
        this.isMenuOpen = !this.isMenuOpen; // Toggle the isMenuOpen property
      });
    }
  }

  onLanguageChange(event: Event): void {
    const selectedRoute = (event.target as HTMLSelectElement).value;
    this.router.navigate([selectedRoute]);
  }

  toggleLogoutDropdown() {
    this.showLogoutDropdown = !this.showLogoutDropdown;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
    this.showLogoutDropdown = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the isMenuOpen property
  }

  goToRecommendation(): void {
    this.router.navigate(['/recommend']);
  }

  goToStatistics(): void {
    this.router.navigate(['/statistics']);
  }
}

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
        this.renderer.addClass(this.navLinks.nativeElement, 'active');
        this.renderer.addClass(this.menuToggle.nativeElement, 'active');
      });
    }
  }

  toggleLogoutDropdown() {
    this.showLogoutDropdown = !this.showLogoutDropdown;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
    this.showLogoutDropdown = false;
  }
}
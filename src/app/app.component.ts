import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'Tour-Booking-System';

  @ViewChild('menuToggle') menuToggle!: ElementRef;
  @ViewChild('navLinks') navLinks!: ElementRef;
  authService: any;
  renderer: any;

  ngAfterViewInit() {
    if (this.menuToggle && this.navLinks) {
      this.renderer.listen(this.menuToggle.nativeElement, 'click', () => {
        this.renderer.toggleClass(this.navLinks.nativeElement, 'active');
        this.renderer.toggleClass(this.menuToggle.nativeElement, 'active');
      });
    }
  }
}

import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from 'src/app/Service/AuthService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Redirect to login page if not authenticated
    this.router.navigate(['/login']);
    return false;
  }
}
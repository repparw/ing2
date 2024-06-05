import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../services/user.service'; // Replace with your authentication service

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.userService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
      if (isAuthenticated) {
        return true; // Allow access if user is authenticated
      } else {
        this.router.navigate(['/login']); // Redirect to login page
        return false;
      }
      })
    );
}

}

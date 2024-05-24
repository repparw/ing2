import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../services/user.service'; // Replace with your user service

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.userService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (user && user.is_employee) {
          return true;
        } else {
          this.router.navigate(['/']); // Redirect to home or unauthorized page
          return false;
        }
      })
    );
  }
}

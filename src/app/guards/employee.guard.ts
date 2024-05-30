import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service'; // Replace with your user service

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  return this.userService.isEmployee$.pipe(
        take(1),
        map(isEmployee => {
          if (isEmployee) {
            return true; // Allow access if user is an employee
          } else {
            console.log('Not authorized');
            this.router.navigate(['/']); // Redirect to home or unauthorized page
            return false;
          }
        })
      );
    }

//  canActivateChild(
//    childRoute: ActivatedRouteSnapshot,
//    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

//    return this.canActivate(childRoute, state); // Delegate to canActivate method
//  }


}

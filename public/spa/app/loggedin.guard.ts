import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class LoggedinGuard implements CanActivate {
  constructor(private _authService: AuthService,
    private _router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this._authService.authenticated()) {
        return true;
      } else { 
        this._router.navigate(['']);
        return false;
      }
  }
}

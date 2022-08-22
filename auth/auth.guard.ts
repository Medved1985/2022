import { Inject, Injectable } from '@angular/core';
import {CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { EnumAuthorizationResult } from '@api/typeConst_pb';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  userInfo: any;
  // isLeroy: string;
  SUCCESS = EnumAuthorizationResult.SUCCESS;
  FIRST_PASSWORD = EnumAuthorizationResult.FIRST_PASSWORD;
  TIME_IS_OVER_INACTIVITY = EnumAuthorizationResult.TIME_IS_OVER_INACTIVITY;
  TIME_IS_OVER_PASSWORD = EnumAuthorizationResult.TIME_IS_OVER_PASSWORD;
  TIME_IS_RUNNING_OUT_PASSWORD = EnumAuthorizationResult.TIME_IS_RUNNING_OUT_PASSWORD;
  ACCOUNT_BANNED = EnumAuthorizationResult.ACCOUNT_BANNED;
  INCORRECT_PASSWORD = EnumAuthorizationResult.INCORRECT_PASSWORD;
  TRY_CONNECTIONS = EnumAuthorizationResult.TRY_CONNECTIONS;

  constructor(private authService: AuthService, private router: Router, @Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.userInfo = JSON.parse(this.storage.get('user1') || '[]');
    // console.log('user1', this.userInfo)
    // this.isLeroy = environment.software
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(next, state);
    const auth = this.authService.checkSaved();
    const path = (next.url.length > 0) ? next.url[0].path : '';

    if (document.location.href.indexOf('monthlyinspection') > -1 ) {
      this.router.navigateByUrl('/events');
    }

    if ((path === 'login' || path === '') && auth) {
      if (this.userInfo === this.FIRST_PASSWORD) {
        // console.log("in new password")
        this.router.navigateByUrl('/new-password');
        return true;
      } else if (document.location.href.indexOf('new-password') > -1) {
        this.router.navigateByUrl('/events');
      } else if (this.userInfo === this.SUCCESS || this.userInfo === this.TIME_IS_RUNNING_OUT_PASSWORD) {
        this.router.navigateByUrl((next.params.to ) ? next.params.to : '/events');
      }
      //  else if (this.userInfo == this.SUCCESS && document.location.href.indexOf('new-password') == 1) {
      //   this.router.navigateByUrl((next.params.to ) ? next.params.to : '/dashboard');
      // }
      return false;
    }

    if (path === '' && !auth) {
      return true;
    }

    if (!auth && (path !== 'login')) {
      const url = this.router.createUrlTree(['/login', (state.url !== '/login') ? {to: state.url} : {}]);
      this.router.navigateByUrl(url);
    } else if (!auth && path === 'login') {
      return true;
    }

    return auth;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}

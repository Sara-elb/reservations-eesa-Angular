import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenIdentificationService } from './token-identification.service';

@Injectable({
  providedIn: 'root'
})


export class AdminGuard implements CanActivate {
  constructor(    
    private tokenIdentification : TokenIdentificationService,
    private router : Router){
      
    }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.tokenIdentification.refreshToken;
    if(this.tokenIdentification.user.value != null 
      && this.tokenIdentification.user.value.droits.includes("ROLE_ADMINISTRATEUR") && !this.tokenIdentification.exp){
      return true;
    }else{
      this.tokenIdentification.onTokenExpired();
      return this.router.parseUrl('/');
    }
  }
}


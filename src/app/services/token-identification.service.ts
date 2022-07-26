import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Calendar } from '@syncfusion/ej2-angular-calendars';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenIdentificationService {


  constructor(    
    private router : Router)
     { }
    //Need application to load new token while login with another user
    public user: BehaviorSubject<any> = new BehaviorSubject(null);
    public exp:boolean=false;

    public padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }

    public formatDate(date: Date) {
      return (
        [
          date.getFullYear(),
          this.padTo2Digits(date.getMonth() + 1),
          this.padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
          this.padTo2Digits(date.getHours()),
          this.padTo2Digits(date.getMinutes()),
          this.padTo2Digits(date.getSeconds()),
        ].join(':')
      );
    }

    public refreshToken() { //extractionToken
      if (localStorage.getItem("token") != null) {
        const token: any = localStorage.getItem("token");
      
        let payload = JSON.parse(atob(token.split('.')[1]));
        var dateString = this.formatDate( new Date());
        var dateStringISO = dateString.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
        var timestamp = new Date(dateStringISO).getTime();

        if (timestamp/1000 > payload.exp){
          this.exp=true;
          this.onTokenExpired();
        }
        try {
          this.user.next(JSON.parse(atob(token.split(".")[1])));
          
        } catch (e) {
          this.user.next(null);
        }
        
      } else {
        this.user.next(null);
      }
    }
  
    public onTokenExpired() {
      localStorage.removeItem("token");
      this.router.parseUrl('/');
    }
  }
import { Component } from '@angular/core';
import { TokenIdentificationService } from './token-identification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'reservations-eesa';
  public email: string = "";
  public admin: boolean=false;
  public monitor: boolean=false;
  public rider: boolean=false;


  constructor(
    private tokenIdentification: TokenIdentificationService
  ) { }

  ngOnInit() {
    this.tokenIdentification.user.subscribe(
      user => {
        if (user != null) {
          this.email = user.sub;
          this.admin = user.droits.includes("ROLE_ADMINISTRATEUR");
          this.monitor = user.droits.includes("ROLE_MONITEUR");
          this.rider = user.droits.includes("ROLE_CAVALIER");
          console.log("admin : "+this.admin+ " monitor : "+this.monitor+ " rider : "+this.rider)
        } else {
          this.email = "";
        }
      }
    );
    this.tokenIdentification.refreshToken();
  }
  
}

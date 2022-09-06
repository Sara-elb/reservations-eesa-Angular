import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { TokenIdentificationService } from './services/token-identification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public name: string = "";
  public identifiant: string = "";

  title = 'reservations-eesa';
  public email: string = "";
  public admin: boolean=false;
  public monitor: boolean=false;
  public rider: boolean=false;

  constructor(
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService
  ) { }

  ngOnInit() {
    this.email=" ";
    this.tokenIdentification.user.subscribe(
      user => {
        if (user != null) {
          this.email = user.sub;
          this.admin = user.droits.includes("ROLE_ADMINISTRATEUR");
          this.monitor = user.droits.includes("ROLE_MONITEUR");
          this.rider = user.droits.includes("ROLE_CAVALIER");
          this.identifiant = user.sub
        } else {
          this.email = "";
        }
      }
    );
    this.tokenIdentification.refreshToken();
    this.refreshName(this.identifiant);

  }

  signOut(){
    this.email = "";
    this.rider=false;
    this.monitor=false;
    this.admin=false;
    this.tokenIdentification.onTokenExpired();
  }

  public refreshName(identifiant: string): void {
    this.client.get("http://" + environment.serverAddress + "/utilisateur/" + identifiant)
      .subscribe((response: any) => {
        this.name = response.prenom;
      });
  }

  
}

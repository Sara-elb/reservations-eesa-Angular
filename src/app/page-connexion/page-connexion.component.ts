import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenIdentificationService } from '../services/token-identification.service';

@Component({
  selector: 'app-page-connexion',
  templateUrl: './page-connexion.component.html',
  styleUrls: ['./page-connexion.component.scss']
})
export class PageConnexionComponent implements OnInit {
  public signInFormControl: UntypedFormGroup = this.formBuilder.group({
    "identifiant": ["", [Validators.required, Validators.minLength(6)]],
    "motDePasse": ["", [Validators.required, Validators.minLength(3)]]
  });
  constructor(
    private client: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private tokenIdentification : TokenIdentificationService,
    private router : Router,
  ) { }

  public admin: boolean = false;
  public monitor: boolean = false;
  public rider: boolean = false;
  public idConnectedUser: any;
  public alertErrorIds ='hidden';

  ngOnInit(): void {
    this.ngOnInit();
  }

  
  onSignIn() {
    if (this.signInFormControl.valid) { 
      const user = this.signInFormControl.value;
      this.client.post('http://' + environment.serverAddress + '/connexion', user)
        .subscribe((response: any) => {
          if (response.erreur) {
            this.alertErrorIds = 'visible';
          } else {
            localStorage.setItem('token', response.token);
            this.tokenIdentification.refreshToken()
            this.getRoles();
            if(this.admin){
              this.router.navigateByUrl('espace-administrateur');
            }else if (this.monitor){
              this.router.navigateByUrl('espace-moniteur');
            }else if(this.rider){
              this.router.navigateByUrl('espace-cavalier');
            }
          }
        });
    }
  }

  getRoles(){
    this.tokenIdentification.user.subscribe(
      user => {
        this.admin = user != null && user.droits.includes("ROLE_ADMINISTRATEUR");
        this.monitor = user !=null && user.droits.includes("ROLE_MONITEUR");
        this.rider = user !=null && user.droits.includes("ROLE_CAVALIER");
        // console.log("admin : "+ this.admin);
        // console.log("monit : "+this.monitor);
        // console.log("caval : "+this.rider);
        this.idConnectedUser = user.id
        // console.log(this.idConnectedUser);
      }
    );
  }

  exitAlertErrorIds(){
    this.alertErrorIds = 'hidden';
  }
}



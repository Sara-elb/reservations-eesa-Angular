import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { CustomValidators } from '../custom-validators';
import { RidersData } from '../page-cavaliers/page-cavaliers.component';
import { TokenIdentificationService } from '../services/token-identification.service';

import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-page-informations-personnelles',
  templateUrl: './page-informations-personnelles.component.html',
  styleUrls: ['./page-informations-personnelles.component.scss']
})

export class PageInformationsPersonnellesComponent implements OnInit {
  public registerForm!: FormGroup;
  public goodPassword : boolean = false;
  public alertEditInfos: boolean = false;
  public passwordPattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[!@#$%^&*_=+-]).(6,8)";
  public emailFormControl: UntypedFormGroup = this.formBuilder.group({
    "adresseEmail": ["",[Validators.required, Validators.email]],
  });

  public levelFormControl: UntypedFormGroup = this.formBuilder.group({
    "niveau": ["", Validators.required],
  });

  public passwordFormControl: UntypedFormGroup = this.formBuilder.group({
    "actualPassword": ["", Validators.required],
    "password": ["", [Validators.required, Validators.minLength(8)]],
    "confirm_password": ["",[Validators.required, Validators.minLength(8)]],
  });

  public hide : boolean =true;
  public levelsList: any;

  public adresseEmail: string = " ";
  public motDePasse: string = " ";
  public niveau: any = null;

  public identifiant: string = " ";
  public nom: string = " ";
  public prenom: string = " ";
  public dateDeNaissance: any;

  public idRider: any;
  public rider: boolean = false;
  public idConnectedUser: any;
  public idNiveau: any=null;
  public passwordValid: any;

  public containerEditEmail = "hidden";
  public containerEditLevel = "hidden";
  public containerEditPassword = "hidden";

  public alertEditEmail: boolean = false;
  public alertErrorEditEmail: boolean = false;

  public alertEditLevel: boolean = false;
  public alertErrorEditLevel: boolean = false;

  public alertEditPassword: boolean = false;
  public alertErrorEditPassword: boolean = false;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,
    private datePipe : DatePipe,
  ) { }

  ngOnInit(): void {
    this.generateLevelsList();

    this.tokenIdentification.user.subscribe(
      user => {
        this.idConnectedUser = user.id
      }
    );
    this.editRider(this.idConnectedUser);

    this.registerForm = this.formBuilder.group({
      email: ['',Validators.email],
      level: [''],
      actualPassword:[''],
      password: ['', Validators.pattern(this.passwordPattern)],
      confirmPassword: ['']
  }, {
      validator: MustMatch('password', 'confirmPassword'),     
  });

  }

  get f() { return this.registerForm.controls; }


  public editRider(idRider: number): void {
    this.client.get("http://" + environment.serverAddress + "/cavalier/" + idRider)
      .subscribe((response: any) => {
        this.identifiant = response.identifiant;
        this.idRider = idRider;
        this.nom = response.nom.toUpperCase();
        this.prenom = response.prenom;
        this.adresseEmail = response.email;
        this.motDePasse = response.motDePasse;
        this.rider=response;

        this.dateDeNaissance=  formatDate(response.dateDeNaissance, 'fullDate', 'fr-FR');
        // this.datePipe.transform(response.dateDeNaissance, 'fullDate', 'fr-FR');
        // console.log(formatDate(element.date, 'fullDate', 'fr-FR'));


        // this.dateDeNaissance

        // console.log(this.datePipe.transform(response.dateDeNaissance, 'dd/MM/yyyy'));
        this.idNiveau = response.niveau.id;
        this.refreshLevel(this.idNiveau);
      });
  }

  generateLevelsList() {
    this.client.get('http://' + environment.serverAddress + '/liste-niveaux')
      .subscribe(response => 
        {this.levelsList = response;
});
    }

  refreshLevel(idLevel: number) {
    this.client.get('http://' + environment.serverAddress + '/niveau/' + idLevel)
      .subscribe((response:any) => {
        this.niveau = response.nom;
      });
  }


    static MatchValidator(source: string, target: string): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const sourceCtrl = control.get(source);
        const targetCtrl = control.get(target);
  
        return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
          ? { mismatch: true }
          : null;
      };
    }
  
    public savePassword(): void {
      this.passwordError();
      let retour :boolean;
      this.motDePasse=this.registerForm.value.confirmPassword;
      if(this.registerForm.value.email){
        console.log(this.registerForm.value.email);
        this.client.post("http://" + environment.serverAddress + "/cavalier/"+this.idRider+"/modifier-email/",this.registerForm.value.email)
        .subscribe((response: any) => {
          retour=response;
          console.log("email"+response);
          console.log(retour);
        });
      }

      if(this.registerForm.value.level){
        console.log(this.registerForm.value.level);
        this.client.post("http://" + environment.serverAddress + "/cavalier/"+this.idRider+"/modifier-niveau/"+this.registerForm.value.level, this.rider)
        .subscribe((response: any) => {
          retour=retour||response;
          console.log("level"+response)
          console.log(retour);
        });
      }
      // console.log(this.registerForm.value.confirmPassword);
      // let body = { cavalier: this.rider, mdp: this.motDePasse }; 
      // let bodyString = JSON.stringify({cavalier: this.rider, mdp:this.motDePasse });

      //const body = { { cavalier:this.rider, mdp:this.motDePasse}};
      console.log(this.rider);
      this.client.post("http://" + environment.serverAddress + "/cavalier/"+this.idRider+"/modifier-mot-de-passe",this.motDePasse)
        .subscribe((response: any) => {
        retour=retour||response;
        console.log("mdp"+response)
        console.log(retour);
        });
      this.containerEditPassword="hidden";
    }

    closeAlertEditInfos() {
      this.alertEditInfos = false;
    }

    public passwordError() {
      const verifPassword = this.registerForm.value.actualPassword;
      console.log(this.registerForm.value.actualPassword);
      this.client.post('http://' + environment.serverAddress + '/passwordControl/'+this.identifiant, verifPassword)
        .subscribe((response: any) => {
          this.goodPassword = response;
          console.log("controle password : " + this.goodPassword)
        });
        
    }

    changeEmail(){
      this.containerEditLevel = "hidden";
      this.containerEditPassword="hidden";
      this.containerEditEmail = "visible";
    }

    changeLevel(){
      this.containerEditPassword="hidden";
      this.containerEditEmail = "hidden";
      this.containerEditLevel = "visible";
    }

    changePassword(){
      this.containerEditEmail = "hidden";
      this.containerEditLevel = "hidden";
      this.containerEditPassword="visible";
    }

    saveLevel(){
      console.log("idNiveau = "+this.registerForm.value.niveau)
      if(this.levelFormControl.valid){
        this.client.post("http://" + environment.serverAddress + "/cavalier/"+ this.idRider+"/modifier-niveau/"+this.levelFormControl.value.niveau , this.rider)
        .subscribe(response => {
          if (response ==true) {
            this.alertEditLevel = true;
            this.containerEditLevel = "hidden";
            this.editRider(this.idConnectedUser);
            console.log("niveau modifié")
          } else {
            this.alertErrorEditLevel = true;
          }
        })
        this.emailFormControl.value.reset;
      }
    }

    saveEmail(){
      console.log("email" + this.emailFormControl.value.adresseEmail);
      if(this.emailFormControl.valid){
        this.client.post("http://" + environment.serverAddress + "/cavalier/"+this.idConnectedUser+"/modifier-email", this.emailFormControl.value.adresseEmail)
      .subscribe(response => {
        if (response == true) {
          this.alertEditEmail = true;
          this.containerEditEmail="hidden";
          this.editRider(this.idConnectedUser);
        } else {
          this.alertErrorEditEmail = true;
        }
      })
    }
    this.emailFormControl.value.reset;
    }

    exitEditEmail(){
      this.containerEditEmail = "hidden";
    }

    exitEditLevel(){
      this.containerEditLevel = "hidden";
    }

    exitEditPassword(){
      this.containerEditPassword = "hidden";
    }

    exitAlertEmailSuccess(){
      this.alertEditEmail = false;
    }

    exitAlertEmailDanger(){
      this.alertErrorEditEmail = false;
    }

    exitAlertLevelDanger(){
      this.alertErrorEditLevel = false;
    }

    exitAlertLevelSuccess(){
      this.alertEditLevel = false;
    }
}

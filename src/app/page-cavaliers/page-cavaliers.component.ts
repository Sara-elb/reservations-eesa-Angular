import { animate, state, style, transition, trigger } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
// import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { MatDateFormats } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenIdentificationService } from '../services/token-identification.service';


export interface RidersData {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  identifiant: string;
  dateDeNaissance: Date;
  niveau: Object;
  listeCards: Array<Object>;
  soldes: Object;
}

@Component({
  selector: 'app-page-cavaliers',
  styleUrls: ['./page-cavaliers.component.scss'],
  templateUrl: './page-cavaliers.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({
        height: '*',
        minHeight: ''
      })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PageCavaliersComponent implements OnInit {
  public containerAddVisible = "hidden";
  public containerEditVisible = "hidden"
  public containerIdsVisible = "hidden";
  public alertAddNewRider: boolean = false;
  public alertEditRider: boolean = false;
  public alertDeleteRider: boolean = false;
  public alertErrorDeleteRider: boolean = false;
  public idRider: any;
  public admin: boolean = false;
  public idConnectedUser: any;
  public identifiant: string = "";
  public newMDP: string = "";
  public levelsList: any;
  public cardsList: any;

  public nom: string = " ";
  public prenom: string = " ";
  public email: string = " ";
  public dateDeNaissance: Date = new Date;
  public niveau: any = null;
  public idNiveau: number = 0;
  // public formater:SimpleDateFormat;
  // public listeCards:Array<Object>;
  // soldes:Object;

  public riderFormControl: UntypedFormGroup = this.formBuilder.group({
    "nom": ["", [Validators.required]],
    "prenom": ["", [Validators.required]],
    "email": ["", [Validators.required, Validators.email]],
    "dateDeNaissance": ["", [Validators.required]],
    "niveau": ["", [Validators.required]],
  });

  public editRiderFormControl: UntypedFormGroup = this.formBuilder.group({
    "nom": ["",],
    "prenom": ["",],
    "email": ["",],
    "dateDeNaissance": ["",],
    "niveau": ["",],
  });

  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'identifiant', 'age', 'actif'];
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand'];

  // columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  dataSource = new MatTableDataSource<RidersData>();
  expandedElement: RidersData | null | undefined;

  riders: any;
  rider = null;
  // expandedElement: RidersData | null | undefined;
  // @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild('idLevel', { static: false }) el!: ElementRef;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,
    private router: Router,
    // private datePipe : DatePipe,
  ) { }


  ngOnInit(): void {
    this.refreshRidersList();
    this.generateLevelsList();

    // this.dataSource.sort = this.sort;
    this.tokenIdentification.user.subscribe(
      user => {
        this.admin = user != null && user.droits.includes("ROLE_ADMINISTRATEUR");
        console.log(this.admin)
        this.idConnectedUser = user.id
        console.log(this.idConnectedUser)
      }
    );
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  refreshRidersList() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-cavaliers/actifs")
      .subscribe(response => {
        this.riders = response;
        this.dataSource = new MatTableDataSource<RidersData>(this.riders);
        this.dataSource.paginator = this.paginator;
        // formater = new SimpleDate
      });
  }

  addRider() {
    this.containerAddVisible = "visible";
  }

  public createRider(): void {
    if (this.riderFormControl.valid) {
      console.log("ok fonction create rider");
      this.rider = this.riderFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/ajouter-cavalier", this.rider)
        .subscribe((response: any) => {
          if (response.length == 2) {
            this.alertAddNewRider = true;
            this.containerAddVisible = "hidden";
            this.identifiant = response[0];
            this.newMDP = response[1];
            this.refreshRidersList();
            this.containerIdsVisible = "visible";
            this.riderFormControl.reset();
          } else {
            alert(response[0]);
            console.log(response[0]);
          }
        })
    }
  }

  public exitNewRider() {
    this.containerAddVisible = "hidden";
  }

  public exitEditRider() {
    this.containerEditVisible = "hidden";
  }

  public exitIds() {
    this.containerIdsVisible = "hidden";
  }

  closeAlertAddNewRider() {
    this.alertAddNewRider = false;
  }

  closeAlertEditRider() {
    this.alertEditRider = false;
  }

  closeAlertDeleteRider() {
    this.alertDeleteRider = false;
  }

  closeAlerErrortDeleteRider() {
    this.alertErrorDeleteRider = false;
  }

  public editRider(idRider: number): void {
    this.containerEditVisible = "visible";
    this.client.get("http://" + environment.serverAddress + "/admin/cavalier/" + idRider)
      .subscribe((response: any) => {
        this.idRider = idRider;
        this.nom = response.nom;
        this.prenom = response.prenom;
        this.email = response.email;
        // this.dateDeNaissance

        // console.log(this.datePipe.transform(response.dateDeNaissance, 'dd/MM/yyyy'));
        this.idNiveau = response.niveau.id;

        console.log(" niveau : " + this.idNiveau)
      });
  }

  validationEditRider(): void {
    this.client.get("http://" + environment.serverAddress + "/niveau/" + this.editRiderFormControl.value.niveau)
      .subscribe((response: any) => {
        this.niveau = response;
        this.editRiderFormControl.value.niveau = this.niveau;
        this.rider = this.editRiderFormControl.value;
      });

    // console.log("ok fonction edit rider"+this.idNiveau);
    this.client.post("http://" + environment.serverAddress + "/admin/modifier/cavalier/" + this.idRider, this.rider)
      .subscribe(rider => {
        if (rider != null) {
          this.alertEditRider = true;
          this.containerEditVisible = "hidden";
          this.refreshRidersList();

          console.log("Rider modifiée")
        } else {
          alert("Erreur lors de la modification ")
        }
      })
    this.editRiderFormControl.value.reset;
  }

  deleteRider(idRider: number): void {
    this.client.post("http://" + environment.serverAddress + "/admin/supprimer/utilisateur/" + idRider, null)
      .subscribe((response: any) => {
        if (response.id == idRider) {
          this.refreshRidersList();
          this.alertDeleteRider = true;
        } else {
          this.alertErrorDeleteRider = true;
        }
      });
  }

  refreshInactivRider() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-cavaliers/non-actifs")
      .subscribe(response => {
        this.riders = response;
        this.dataSource = new MatTableDataSource<RidersData>(this.riders);
        this.dataSource.paginator = this.paginator;
      });
  }

  refreshActivRider() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-cavaliers/actifs")
      .subscribe(response => {
        this.riders = response;
        this.dataSource = new MatTableDataSource<RidersData>(this.riders);
        this.dataSource.paginator = this.paginator;
      });
  }

  generateLevelsList() {
    this.client.get('http://' + environment.serverAddress + '/liste-niveaux')
      .subscribe(response => this.levelsList = response);
  }

  infoRider(idRider: number) {
    this.client.get('http://' + environment.serverAddress + '/admin/cartes/cavalier/' + idRider)
      .subscribe(response => this.cardsList = response);
  }

  refreshLevel(idLevel: number) {
    this.client.get('http://' + environment.serverAddress + '/admin/cavalier/galop/' + idLevel)
      .subscribe(response => {
        this.riders = response;
        this.dataSource = new MatTableDataSource<RidersData>(this.riders);
        this.dataSource.paginator = this.paginator;
      });
  }

}
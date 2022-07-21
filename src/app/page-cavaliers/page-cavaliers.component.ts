import { ListKeyManager } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenIdentificationService } from '../token-identification.service';


export interface RidersData {  
  id: number;
  nom: string;
  prenom: string;
  email: string;
  actif:boolean;
  identifiant:string;
  dateDeNaissance:Date;
  niveau:Object;
  listeCards:Array<Object>;
  soldes:Object;
}

@Component({
  selector: 'app-page-cavaliers',
  templateUrl: './page-cavaliers.component.html',
  styleUrls: ['./page-cavaliers.component.scss']
})

export class PageCavaliersComponent implements OnInit {
  public containerAddVisible = "hidden";
  public containerEditVisible = "hidden"
  // message: any;
  public alertAddNewRider : boolean = false;
  public alertEditRider : boolean =false;
  public alertDeleteRider:boolean=false;
  public alertErrorDeleteRider:boolean=false;
  public typeSeance: string ="";
  public nbSeances: number=0;
  public idRider: any;
  public admin: boolean = false;
  public idConnectedUser: any;
  public identifiant:string="";
  public newMDP:string="";

  public riderFormControl: FormGroup = this.formBuilder.group({
    "type": ["", [Validators.required]],
    "nbSeances": ["", [Validators.required]]
  });

  displayedColumns: string[] = ['id', 'nom', 'prenom','email','identifiant','age','niveau','actif'];
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand'];

  // columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  dataSource = new MatTableDataSource<RidersData>();
  riders : any;
  rider = null;
  // expandedElement: RidersData | null | undefined;
  // @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    private formBuilder: FormBuilder,
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.refreshRidersList();

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
    this.client.get('http://' + environment.serverAddress + '/admin/liste-utilisateurs')
      .subscribe(response => {
        this.riders = response;
        this.dataSource = new MatTableDataSource<RidersData>(this.riders);
        this.dataSource.paginator = this.paginator;
      });
  }

  addRider(){
    this.containerAddVisible = "visible";
  } 

  public createRider(): void {
    if (this.riderFormControl.valid) {
      console.log("ok fonction create rider");
      this.rider = this.riderFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/ajoutercavalier", this.rider)
        .subscribe((rider:any) => {
          if (rider != null) {
            this.alertAddNewRider=true;
            this.containerAddVisible = "hidden";
            this.newMDP= rider.motDePasse;
            this.identifiant=rider.identifiant;

            console.log("rider créée")
          } else {
              alert("erreur")
          }
        })
    }
    this.refreshRidersList();
  }

  public exitNewRider() {
    this.containerAddVisible = "hidden";
  }

  public exitEditRider() {
    this.containerEditVisible = "hidden";
  }

  closeAlertAddNewRider(){
    this.alertAddNewRider=false;
  }

  closeAlertEditRider(){
    this.alertEditRider=false;
  }

  closeAlertDeleteRider(){
    this.alertDeleteRider=false;
  }
  
  closeAlerErrortDeleteRider(){
    this.alertErrorDeleteRider=false;
  }

  public editRider(idRider:number): void {
    this.containerEditVisible = "visible";
    this.client.get("http://"+ environment.serverAddress +"/admin/cavalier/"+idRider)
    .subscribe((response:any) => { 
      this.idRider=idRider;
      console.log("idRider"+this.idRider)
      this.typeSeance=response.type;
      console.log(this.typeSeance+" nb : "+this.nbSeances)
      this.nbSeances=response.nbSeances;
    });


  
  }

  validationEditRider():void{
    if (this.riderFormControl.valid) {
      console.log("ok fonction edit rider"+this.idRider);
      this.rider = this.riderFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/modifier/cavalier/"+ this.idRider, this.rider)
        .subscribe(rider => {
          if (rider != null) {
            this.alertEditRider=true;
            this.containerEditVisible = "hidden";
            this.refreshRidersList();

            console.log("Rider modifiée")
          } else {
              alert("Erreur lors de la modification ")
          }
        })
    }
  }

  deleteRider(idRider:number): void {
    this.client.delete("http://" + environment.serverAddress + "/admin/supprimer/utilisateur/"+ idRider)
    .subscribe(response => 
      {
        if(response!=null){
          this.alertDeleteRider=true;
          this.refreshRidersList();
        }else{
          this.alertErrorDeleteRider=true;
        }
      });
  }

  refreshInactivRider(){
    this.client.get("http://"+ environment.serverAddress +"/admin/liste-riders/non-actives")
    .subscribe(response => {
      this.riders = response;
      this.dataSource = new MatTableDataSource<RidersData>(this.riders);
      this.dataSource.paginator = this.paginator;

    });
  }

  refreshActivRider(){
    this.client.get("http://"+ environment.serverAddress +"/admin/liste-riders/actives")
    .subscribe(response => {
      this.riders = response;
      this.dataSource = new MatTableDataSource<RidersData>(this.riders);
      this.dataSource.paginator = this.paginator;
    });
  }

}

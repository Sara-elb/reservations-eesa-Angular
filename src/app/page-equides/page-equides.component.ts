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


export interface HorsesData {
  id: number;
  nom: string;
  actif: boolean;
  dateDeNaissance: Date;
  type: Object;
}

@Component({
  selector: 'app-page-equides',
  styleUrls: ['./page-equides.component.scss'],
  templateUrl: './page-equides.component.html',
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
export class PageEquidesComponent implements OnInit {
  public containerAddVisible = "hidden";
  public containerEditVisible = "hidden"
  public alertAddNewHorse: boolean = false;
  public alertEditHorse: boolean = false;
  public alertDeleteHorse: boolean = false;
  public alertErrorDeleteHorse: boolean = false;
  public idHorse: any;
  public admin: boolean = false;
  public idConnectedUser: any;
  public identifiant: string = "";
  public newMDP: string = "";
  public typesList: any;
  public cardsList: any;

  public nom: string = " ";
  public nombreReprise: number =0;
  // public email: string = " ";
  public dateDeNaissance: Date = new Date;
  public typeEquide: any = null;
  public idTypeEquide: number = 0;
  // public formater:SimpleDateFormat;
  // public listeCards:Array<Object>;
  // soldes:Object;

  public horseFormControl: UntypedFormGroup = this.formBuilder.group({
    "nom": ["", [Validators.required]],
    "dateNaissance": ["", [Validators.required]],
    "typeEquide": ["", [Validators.required]],
    "nombreReprise": ["", [Validators.required]],

  });

  public editHorseFormControl: UntypedFormGroup = this.formBuilder.group({
    "nom": ["",],
    "typeEquide": ["",],
    "dateNaissance": ["",],
    "nombreReprise": ["",],
  });

  displayedColumns: string[] = ['id', 'nom', 'dateNaissance', 'actif','nombreReprise'];
  displayedColumnsWithOption = [...this.displayedColumns, 'option'];

  displayedColumnsWithExpand = [...this.displayedColumnsWithOption, 'expand'];


  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  dataSource = new MatTableDataSource<HorsesData>();
  expandedElement: HorsesData | null | undefined;

  horses: any;
  horse = null;
  // expandedElement: HorsesData | null | undefined;
  // @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild('idLevel', { static: false }) el!: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.refreshHorsesList();
    this.refreshType();

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

  refreshHorsesList() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-equides/actifs")
      .subscribe(response => {
        this.horses = response;
        this.dataSource = new MatTableDataSource<HorsesData>(this.horses);
        this.dataSource.paginator = this.paginator;
        // formater = new SimpleDate
      });
  }

  addHorse() {
    this.containerAddVisible = "visible";
  }

  public createHorse(): void {
    if (this.horseFormControl.valid) {
      console.log("ok fonction create horse");
      this.horse = this.horseFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/ajouter-equide", this.horse)
        .subscribe((response: any) => {
          if (response) {
            this.alertAddNewHorse = true;
            this.containerAddVisible = "hidden";
            this.refreshHorsesList();
            this.horseFormControl.reset();
          } else {
            alert("attention");
          }
        })
    }
  }

  public exitNewHorse() {
    this.containerAddVisible = "hidden";
  }

  public exitEditHorse() {
    this.containerEditVisible = "hidden";
  }

  closeAlertAddNewHorse() {
    this.alertAddNewHorse = false;
  }

  closeAlertEditHorse() {
    this.alertEditHorse = false;
  }

  closeAlertDeleteHorse() {
    this.alertDeleteHorse = false;
  }

  closeAlerErrortDeleteHorse() {
    this.alertErrorDeleteHorse = false;
  }

  public editHorse(idHorse: number): void {
    console.log(idHorse);
    this.containerEditVisible = "visible";
    this.client.get("http://" + environment.serverAddress + "/admin/equide/" + idHorse)
      .subscribe((response: any) => {
        this.idHorse = idHorse;
        this.nom = response.nom;
        this.nombreReprise = response.nombreReprise;
        this.dateDeNaissance=response.dateNaissance

        // console.log(this.datePipe.transform(response.dateDeNaissance, 'dd/MM/yyyy'));
        this.idTypeEquide = response.typeEquide.id;
        

        console.log(" typeEquide : " + this.idTypeEquide)
      });
  }

  validationEditHorse(): void {
    this.client.get("http://" + environment.serverAddress + "/typeEquide/" + this.idTypeEquide)
      .subscribe((response: any) => {
        this.typeEquide = response;
        console.log(response.nom);
        console.log(this.typeEquide);
        this.editHorseFormControl.value.type = response;

        this.horse = this.editHorseFormControl.value;
      });


      // this.editHorseFormControl.value.type = this.typeEquide;

      // this.horse = this.editHorseFormControl.value;
      // .subscribe((response: any) => {
      //   this.niveau = response;
      //   this.editRiderFormControl.value.niveau = this.niveau;
      //   this.rider = this.editRiderFormControl.value;
      // });

    // console.log("ok fonction edit horse"+this.idNiveau);
    this.client.post("http://" + environment.serverAddress + "/admin/modifier/equide/" + this.idHorse, this.horse)
      .subscribe(horse => {
        if (horse != null) {
          console.log("là fct horse ");

          this.alertEditHorse = true;
          this.containerEditVisible = "hidden";
          this.refreshHorsesList();

          console.log("Horse modifiée")
        } else {
          alert("Erreur lors de la modification ")
        }
      })
    this.editHorseFormControl.value.reset;
  }

  deleteHorse(idHorse: number): void {
    this.client.delete("http://" + environment.serverAddress + "/admin/supprimer/equide/" + idHorse)
      .subscribe((response: any) => {
        if (response.id == idHorse) {
          this.refreshHorsesList();
          this.alertDeleteHorse = true;
        } else {
          this.alertErrorDeleteHorse = true;
        }
      });
  }

  refreshInactivHorse() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-equides/non-actifs")
      .subscribe(response => {
        this.horses = response;
        this.dataSource = new MatTableDataSource<HorsesData>(this.horses);
        this.dataSource.paginator = this.paginator;
      });
  }

  refreshActivHorse() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-equides/actifs")
      .subscribe(response => {
        this.horses = response;
        this.dataSource = new MatTableDataSource<HorsesData>(this.horses);
        this.dataSource.paginator = this.paginator;
      });
  }

  refreshType() {
    this.client.get('http://' + environment.serverAddress + '/admin/liste-types')
      .subscribe(response => this.typesList = response);
  }

  infoHorse(idHorse: number) {
    this.client.get('http://' + environment.serverAddress + '/admin/cartes/equide/' + idHorse)
      .subscribe(response => this.cardsList = response);
  }

  generateType(idLevel: number) {
    this.client.get('http://' + environment.serverAddress + '/admin/equide/type/' + idLevel)
      .subscribe(response => {
        this.horses = response;
        this.dataSource = new MatTableDataSource<HorsesData>(this.horses);
        this.dataSource.paginator = this.paginator;
      });
  }


}

import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenIdentificationService } from '../services/token-identification.service';
import {jsPDF} from "jspdf";

export interface CardsData {  
  id: number;
  type: string;
  nbSeances: number;
}

@Component({
  selector: 'app-page-cartes',
  templateUrl: './page-cartes.component.html',
  styleUrls: ['./page-cartes.component.scss'],
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({ height: '0px', minHeight: '0' })),
  //     state('expanded', style({
  //       height: '*',
  //       minHeight: ''
  //     })),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
})


export class PageCartesComponent implements OnInit {
  public containerAddVisible = "hidden";
  public containerEditVisible = "hidden"
  message: any;
  public alertAddNewCard : boolean = false;
  public  alertEditCard : boolean =false;
  public alertDeleteCard:boolean=false;
  public alertErrorDeleteCard:boolean=false;
  public typeSeance: string ="";
  public nbSeances: number=0;
  public idCarte: any;



  public cardFormControl: FormGroup = this.formBuilder.group({
    "type": ["", [Validators.required]],
    "nbSeances": ["", [Validators.required]]
  });

  public editCardFormControl: FormGroup = this.formBuilder.group({
    "type": ["", Validators.required ],
    "nbSeances": ["", Validators.required ]
  });

  displayedColumns: string[] = ['id', 'typeCarte', 'nbSeances'];
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand'];

  // columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  dataSource = new MatTableDataSource<CardsData>();
  cards : any;
  carte = null;
  // expandedElement: CardsData | null | undefined;
  // @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild('content', {static: false}) el!:ElementRef;


  constructor(
    private formBuilder: FormBuilder,
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,
    private router: Router,
  ) { 
    // this.dataSource = new MatTableDataSource<CardsData>(this.cards);
  }

  public admin: boolean = false;
  public idConnectedUser: any;

  // ngOnInit(): void {
  //   this.refreshCardsList();
  //   this.dataSource = new MatTableDataSource<CardsData>(this.cards);
  // }

  ngOnInit(): void {
    this.refreshCardsList();

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

  refreshCardsList() {
    this.client.get('http://' + environment.serverAddress + '/admin/liste-cartes')
      .subscribe(response => {
        this.cards = response;
        this.dataSource = new MatTableDataSource<CardsData>(this.cards);
        this.dataSource.paginator = this.paginator;
      });
  }

  addCard(){
    this.containerAddVisible = "visible";
  } 

  public createCard(): void {
    if (this.cardFormControl.valid) {
      console.log("ok fonction create card");
      this.carte = this.cardFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/ajouter-carte", this.carte)
        .subscribe(carte => {
          if (carte != null) {
            this.alertAddNewCard=true;
            this.containerAddVisible = "hidden";

            //   alert("carte créée")
            console.log("carte créée")
          } else {
              alert("erreur")
          }
        })
    }
    this.refreshCardsList();
  }

  public exitNewCard() {
    this.containerAddVisible = "hidden";
  }

  public exitEditCard() {
    this.containerEditVisible = "hidden";
  }

  closeAlertAddNewCard(){
    this.alertAddNewCard=false;
  }

  closeAlertEditCard(){
    this.alertEditCard=false;
  }

  closeAlertDeleteCard(){
    this.alertDeleteCard=false;
  }
  
  closeAlerErrortDeleteCard(){
    this.alertErrorDeleteCard=false;
  }

  public editCard(idCard:number): void {
    this.client.get("http://"+ environment.serverAddress +"/carte/"+idCard)
    .subscribe((response:any) => { 
      this.idCarte=idCard;
      this.typeSeance=response.type;
      this.nbSeances=response.nbSeances;
      console.log(" bouton edit -- id "+this.idCarte +" typeSeance "+this.typeSeance+ " nb seance "+this.nbSeances)
    }); 
    this.containerEditVisible = "visible";
  }

  validationEditCard():void{
    // this.editCard(this.idCarte);
  if(this.editCardFormControl.value.type == "" ){
        console.log("ici")
        this.editCardFormControl.value.type = this.typeSeance;
      
        this.carte = this.editCardFormControl.value;
        this.client.post("http://" + environment.serverAddress + "/admin/modifier-carte/"+ this.idCarte, this.carte)
          .subscribe(carte => {
            if (carte != null) {
              this.alertEditCard=true;
              this.containerEditVisible = "hidden";
              this.refreshCardsList();
              console.log("Carte modifiée");

            } else {
                alert("Erreur lors de la modification ")
            }
          })
    }else if( this.editCardFormControl.value.nbSeances == "" || this.editCardFormControl.value.nbSeances ==null){
      console.log("ichelpi")
      this.editCardFormControl.value.nbSeances = this.nbSeances;
    
      this.carte = this.editCardFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/modifier-carte/"+ this.idCarte, this.carte)
        .subscribe(carte => {
          if (carte != null) {
            this.alertEditCard=true;
            this.containerEditVisible = "hidden";
            this.refreshCardsList();
            console.log("Carte modifiée");

          } else {
              alert("Erreur lors de la modification ")
          }
        })
    }else if (this.editCardFormControl.valid) {
      console.log("là");
      this.carte = this.editCardFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/modifier-carte/"+ this.idCarte, this.carte)
        .subscribe(carte => {
          if (carte != null) {
            this.alertEditCard=true;
            this.containerEditVisible = "hidden";
            this.refreshCardsList();
            console.log("Carte modifiée");
          } else {
              alert("Erreur lors de la modification ")
          }
        })
    }
    else{
      alert("Erreur : formulaire mal complété")
    }
    this.editCardFormControl.value.type="";

    this.editCardFormControl.value.nbSeances="";
  }

  deleteCard(idCard:number): void {
    this.client.delete("http://" + environment.serverAddress + "/admin/supprimer-carte/"+ idCard)
    .subscribe(response => 
      {
        if(response==true){
          this.alertDeleteCard=true;
          this.refreshCardsList();
        }else{
          this.alertErrorDeleteCard=true;
        }
      });
  }

  refreshInactivCard(){
    this.client.get("http://"+ environment.serverAddress +"/admin/liste-cartes/non-actives")
    .subscribe(response => {
      this.cards = response;
      this.dataSource = new MatTableDataSource<CardsData>(this.cards);
      this.dataSource.paginator = this.paginator;

    });
  }

  refreshActivCard(){
    this.client.get("http://"+ environment.serverAddress +"/admin/liste-cartes/actives")
    .subscribe(response => {
      this.cards = response;
      this.dataSource = new MatTableDataSource<CardsData>(this.cards);
      this.dataSource.paginator = this.paginator;
    });
  }

  makePDF(){
    let pdf = new jsPDF('p','pt','a4');
    pdf.html(this.el.nativeElement, {
      callback:(pdf)=>{
        pdf.save("historique.pdf");
      }
    });
  }

}

function value(value: any, arg1: { this: any; }) {
  throw new Error('Function not implemented.');
}




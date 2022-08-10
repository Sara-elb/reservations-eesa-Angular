import { HttpClient } from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, Inject, OnInit, Pipe, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { TokenIdentificationService } from '../services/token-identification.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
// import {  } from 'angular-calendar';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import 'moment/locale/ja';
import 'moment/locale/fr';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';


export interface ReservationsData {
  id: number;
  dateReservation: Date;
  dateSeance: Date;
  listeNiveaux: any;
  typeSeance:string;
  dureeSeance:number;
  categories:any;
}

@Component({
  selector: 'app-historique-reservations',
  templateUrl: './historique-reservations.component.html',
  styleUrls: ['./historique-reservations.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})


export class HistoriqueReservationsComponent implements AfterViewInit {
  public levelsList: any;

  displayedColumns: string[] = ['id', 'dateReservation', 'dateSeance', 'listeNiveaux','typeSeance','dureeSeance','categories'];
  dataSource= new MatTableDataSource<ReservationsData>();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) 
  sort!: MatSort;

  reservationsList = new Array;

  @ViewChild('content', {static: false}) el!:ElementRef;

  constructor(
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,
    private router: Router,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) 
    private _locale: string,
    private datePipe : DatePipe,
  ) {
    
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
  }


  public rider: boolean = false;
  public idConnectedUser: any;

  ngAfterViewInit() {
    this._locale = 'fr';
    this._adapter.setLocale(this._locale);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.tokenIdentification.refreshToken(); 
    this.tokenIdentification.user.subscribe(
      user => {
      this.rider = user !=null && user.droits.includes("ROLE_CAVALIER");
      this.idConnectedUser = user.id}
    );
    this.generateReservations(this.idConnectedUser);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public generateReservations(idRider: number): void {
    this.client.get("http://" + environment.serverAddress + "/reservation-seance/cavalier/" + idRider)
      .subscribe((response: any) => {
        console.log(response);
      console.log( this.datePipe.transform('2022-07-19T17:45:00.000+00:00', 'jj/MM/aaaa'));

        response.forEach((element:any)=>{
          element.date=this.datePipe.transform(element.date, 'fullDate', 'fr-FR');
          
          element.seance.date=this.datePipe.transform(element.seance.date, 'medium');
          // console.log(formatDate(element.date, 'fullDate', 'fr-FR'));
        });
          // element.listeNiveaux.push(this.generateLevelsList(element.seance.id)[0]);
          // element.listeNiveaux.push(this.generateLevelsList(element.seance.id)[1]);

          // this.reservationsList.push(element);
          // console.log("kklkl" +this.generateLevelsList(element.seance.id)[0]);
        // response.seance.date= this.datePipe.transform(response.seance.date, 'dd/MM/yyyy');


        this.reservationsList=response;
        this.dataSource = new MatTableDataSource(this.reservationsList);
        this.dataSource.paginator = this.paginator;

        })
      }
        
        // this.reservationsList.forEach((element:any) => {
        //   element.listeNiveaux = this.generateLevelsList(element.id);
        // });
  
  public generateLevelsList(idSeance:number):any {
    this.client.get('http://' + environment.serverAddress + '/niveauxSeances/'+idSeance)
      .subscribe(response => {
        console.log(response);
        return response;
      ;})
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


/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
//     ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
//     '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
//   };
// }

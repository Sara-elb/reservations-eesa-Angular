import { HttpClient } from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { TokenIdentificationService } from '../services/token-identification.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from 'angular-calendar';
import { FormControl } from '@angular/forms';


export interface ReservationsData {
  id: number;
  dateReservation: Date;
  dateSeance: Date;
  listeNiveaux: any;
  typeSeance:string;
  dureeSeance:number;
}

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-historique-reservations',
  templateUrl: './historique-reservations.component.html',
  styleUrls: ['./historique-reservations.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HistoriqueReservationsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'dateReservation', 'dateSeance', 'listeNiveaux','typeSeance','dureeSeance'];
  dataSource= new MatTableDataSource<ReservationsData>();
  date = new FormControl(moment());

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) 
  sort!: MatSort;

  reservationsList : any;

  @ViewChild('content', {static: false}) el!:ElementRef;

  constructor(
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,
    private router: Router,
  ) {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
  }

  public rider: boolean = false;
  public idConnectedUser: any;

  ngAfterViewInit() {
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
        this.reservationsList = response;
        this.dataSource = new MatTableDataSource(this.reservationsList);

        this.dataSource.paginator = this.paginator;
        console.log(" idRider : " + idRider)
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

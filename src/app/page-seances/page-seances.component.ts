import { DatePipe, Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenIdentificationService } from '../services/token-identification.service';

export interface SessionsData {
  id: number;
  typeSeance: string;
  nombrePlaces: number;
  // equideSeance:string;
  listeNiveaux:string[];
  commentaire:string;
  dateDebut:Date;
  horaire:Time;
  duree:number;
  // couleur:string;
  categorie:string;
  options:string;
}

@Component({
  selector: 'app-page-seances',
  templateUrl: './page-seances.component.html',
  styleUrls: ['./page-seances.component.scss']
})
export class PageSeancesComponent implements OnInit {
  public admin: boolean = false;
  public idConnectedUser: any;
  public sessionsList:any;
  displayedColumns: string[] = ['id', 'nombrePlaces', 'typeSeance','listeNiveaux','commentaire','dateDebut','horaire','duree','categorie','options'];

  dataSource= new MatTableDataSource<SessionsData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(    
    private formBuilder: UntypedFormBuilder,
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,
    private router: Router,
    private datePipe : DatePipe,
    ) {}

  ngOnInit(): void {
    this.refreshSessionsList();

    this.tokenIdentification.user.subscribe(
      user => {
        this.admin = user != null && user.droits.includes("ROLE_ADMINISTRATEUR");
        console.log(this.admin)
        this.idConnectedUser = user.id
        console.log(this.idConnectedUser)
      }
    );

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  refreshSessionsList() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-seances")
      .subscribe((response:any) => {
        this.sessionsList = response;
        response.forEach((element:any)=>{
          element.dateDebut=this.datePipe.transform(element.dateDebut, 'fullDate', 'fr-FR');
          this.client.get('http://' + environment.serverAddress + '/niveauxSeances/'+element.id)
          .subscribe((response:any) => {
            element.listeNiveaux = response;
          });
          this.client.get('http://'+ environment.serverAddress + '/equidesSeances/'+element.id)
          .subscribe((response:any)=>{
            element.categorie = response;
          });
        });
        this.dataSource = new MatTableDataSource<SessionsData>(this.sessionsList);
        this.dataSource.paginator = this.paginator;
      });
  }

  deleteSession(idSession:number){

  }

  editSession(idSession:number){

  }
}



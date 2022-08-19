import { Component,ChangeDetectionStrategy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
// import endOfDay from 'date-fns/endOfDay';
// import startOfDay from 'date-fns/startOfDay';
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { isSameMonth, isSameDay } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { CardsData } from '../page-cartes/page-cartes.component';
import { TokenIdentificationService } from '../services/token-identification.service';

const colors: Record<string, EventColor>={
  yellow: {
    primary!: '#feff99',
    secondary!: '#fffb04',
  },
  blue: {
    primary!: '#9ccbff',
    secondary!: '#5275a0',
  },
  red: {
    primary!: '#ffcc9a',
    secondary!: '#f7a757',
  },
};

interface MyEvent extends CalendarEvent {
  nombrePlaces: number;
  typeSeance: String,
  niveau: Array<String>;
  equideSeance:Array<String>;
}

@Component({
  selector: 'app-espace-administrateur',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './espace-administrateur.component.html',
  styleUrls: ['./espace-administrateur.component.scss']
})

export class EspaceAdministrateurComponent implements OnInit {
public sessionsList:any;
public admin: boolean =false;
public idConnectedUser:any;
public containerAddVisible = "hidden";
public levelsList: any;
public typeSessionList: any;
public typeEquideList: any;
public session : any;
public sessionId : any;
public typeEquide : any;
public duree : number = 0;

public sessionFormControl: UntypedFormGroup = this.formBuilder.group({
  "commentaire": [""],
  "nombrePlaces": ["", [Validators.required]],
  "dateDebut": [""],
  "dateFin": [""],
  "duree": [""],
  "couleur": [""],
  "typeSeance": [""],
  "typeEquideId": [""],
  "niveau": ["", [Validators.required]],
});

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    //event: CalendarEvent;
    event: MyEvent;
  };


  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: MyEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: MyEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: MyEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(private modal : NgbModal,
    private formBuilder: UntypedFormBuilder,
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService,) { }

  ngOnInit(): void {
    this.tokenIdentification.user.subscribe(
      user => {
        this.admin = user != null && user.droits.includes("ROLE_ADMINISTRATEUR");
        console.log(this.admin)
        this.idConnectedUser = user.id
        console.log(this.idConnectedUser)
      });
    this.generateLevelsList();
    this.generateTypeSessionList();
    this.generateTypeEquideList();
    this.refreshSessionsList();
    // this.events = this.sessionsList;

      //[
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: { ...colors.red },
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    //   nombrePlaces:7,
    //   typeSeance:'',
    //   niveau:[''],
    //   equideSeance:['']
    // }
  //]

  }

  generateLevelsList() {
    this.client.get('http://' + environment.serverAddress + '/liste-niveaux')
      .subscribe(response => this.levelsList = response);
  }

  generateTypeSessionList() {
    this.client.get('http://' + environment.serverAddress + '/admin/liste-types-seances')
      .subscribe(response => this.typeSessionList = response);
  }

  generateTypeEquideList() {
    this.client.get('http://' + environment.serverAddress + '/admin/liste-types')
      .subscribe(response => this.typeEquideList = response);
  }

  refreshSessionsList() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-seances")
      .subscribe(response => {
        this.sessionsList = response;
        this.sessionsList.forEach((seance: { commentaire: any; nombrePlaces: any; dateDebut: any; dateFin: any; typeSeance: any; }) => {
          this.events = [
            ...this.events,
            {
              title: seance.commentaire,
              nombrePlaces:seance.nombrePlaces,
              start: new Date(seance.dateDebut),
              end: new Date(seance.dateFin),
              color: colors.red,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              typeSeance:seance.typeSeance,
              niveau:[''],
              equideSeance:[''],
            },
          ];
        });
        console.log("liste events : "+this.events);

      });

  }

  // refreshCardsList() {
  //   if(this.admin){
  //     this.client.get('http://' + environment.serverAddress + '/admin/liste-seances')
  //     .subscribe(response => {
  //       this.sessionsList = response;
  //     });
  //   }
  // }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  //   console.log(date);
  //   // this.openAppointmentList(date)
  // }

  setView(view: CalendarView) {
    this.view = view;
  }



//   let data=fromdb();
// for(let x of data)
// {
// this.events = [
//           ...this.events,
//           {
// 	start:x["appointment_date"],
// 	title:x["patient_name"]+x["medical_problem"]
//  	 }
// 	]
// }

eventTimesChanged({
  event ,
  newStart,
  newEnd,
  newNombrePlaces,
  newTypeSeance,
  newNiveau,
  newEquideSeance
}: CalendarEventTimesChangedEvent): void {
  this.events = this.events.map((iEvent) => {
    if (iEvent === event) {
      return {
        ...event,
        start: newStart,
        end: newEnd,
        nombrePlaces:newNombrePlaces,
        typeSeance:newTypeSeance,
        niveau:newNiveau,
        equideSeance:newEquideSeance
      };
    }
    return iEvent;
  });
  this.handleEvent('Dropped ou redimensionner', event);
}

  handleEvent(action: string, event: MyEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public exitNewSession() {
    this.containerAddVisible = "hidden";
  }

  addEvent(): void {
    this.createSession();
    this.containerAddVisible="visible";
    this.events = [
      ...this.events,
      {
        title: 'Nouvel évènement',
        nombrePlaces:7,
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        typeSeance:'Ethologie',
        niveau:['Preparartoin galop 1'],
        equideSeance:['chevaux'],
      },
    ];
  }

  formulaireSeance():void{
    this.containerAddVisible="visible";
  }

  public createSession(): void {
    this.typeEquide=this.sessionFormControl.value.typeEquideId;
    this.duree= this.sessionFormControl.value.fin - this.sessionFormControl.value.date;
    this.sessionFormControl.value.duree = this.duree as number;
    console.log(this.sessionFormControl.value.duree + "et la duree "+ this.duree);
    if (this.sessionFormControl.valid) {
      this.session = this.sessionFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/ajouter-seance", this.session)
        .subscribe((response: any) => {
          if (response) {
            this.containerAddVisible = "hidden";
            this.refreshSessionsList;
            this.sessionId = response.id;
            for (let element of this.typeEquide) {
              this.client.post("http://"+environment.serverAddress+"/type_equides_seances/" + element +"/"+this.sessionId, null)
              .subscribe();
              }
            for (let element of this.sessionFormControl.value.niveau) {
              this.client.post("http://"+environment.serverAddress+"/niveau_seances/" + element +"/"+this.sessionId, null)
              .subscribe();
            }
            this.sessionFormControl.reset();
          } else {
            alert("attention");
          }
        })
    }
  }

}

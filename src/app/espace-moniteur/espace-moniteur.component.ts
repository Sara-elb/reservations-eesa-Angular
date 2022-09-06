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
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
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
  selector: 'app-espace-moniteur',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './espace-moniteur.component.html',
  styleUrls: ['./espace-moniteur.component.scss']
})

export class EspaceMoniteurComponent implements OnInit {
  public containerAttributionHorse = "hidden";
  public sessionsList:any;
  public monitor: boolean = false;
  public idConnectedUser:any;
  public levelsList: any;
  public equideList:any;
  public typeSessionList: any;
  public typeEquideList: any;
  public session : any;
  public sessionId : any;
  public typeEquide : any;
  public duree : number = 0;
  public registeredRiders:any;
  public reservations:any;
  public alertVoidSession ='hidden';


//   public attributionFormControl0: UntypedFormGroup = this.formBuilder.group({
//     "equide": ["", [Validators.required]]
//     });

//   public attributionFormControl1: UntypedFormGroup = this.formBuilder.group({
//       "equide": ["", [Validators.required]]
//   });

//   public attributionFormControl2: UntypedFormGroup = this.formBuilder.group({
//     "equide": ["", [Validators.required]]
// });

// public attributionFormControl3: UntypedFormGroup = this.formBuilder.group({
//   "equide": ["", [Validators.required]]
// });

// public attributionFormControl4: UntypedFormGroup = this.formBuilder.group({
//   "equide": ["", [Validators.required]]
// });

// public attributionFormControl5: UntypedFormGroup = this.formBuilder.group({
//   "equide": ["", [Validators.required]]
// });

// public attributionFormControl: UntypedFormGroup = this.formBuilder.group({
//   "equide": ["", [Validators.required]]
// });

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
  
    view: CalendarView = CalendarView.Week;
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
          // this.handleEvent('Edited', event);
        },
      },
      {
        label: '<i class="fas fa-fw fa-trash-alt"></i>',
        a11yLabel: 'Delete',
        onClick: ({ event }: { event: MyEvent }): void => {
          this.events = this.events.filter((iEvent) => iEvent !== event);
          // this.handleEvent('Deleted', event);
        },
      },
    ];

    refresh = new Subject<void>();

    events: MyEvent[] = [];
  
    activeDayIsOpen: boolean = true;

  constructor(
    private modal : NgbModal,
    private formBuilder: UntypedFormBuilder,
    private client: HttpClient,
    private tokenIdentification: TokenIdentificationService
  ) { }

  ngOnInit(): void {
    this.tokenIdentification.user.subscribe(
      user => {
        this.monitor = user != null && user.droits.includes("ROLE_MONITEUR");
        this.idConnectedUser = user.id
      });
      this.refreshSessionsList();
    this.generateLevelsList();
    this.generateEquidesList();
    this.generateTypeSessionList();
    this.generateTypeEquideList();
  }

  
  generateLevelsList() {
    this.client.get('http://' + environment.serverAddress + '/liste-niveaux')
      .subscribe(response => this.levelsList = response);
  }

  generateEquidesList() {
    this.client.get('http://' + environment.serverAddress + '/moniteur/liste-equides')
    .subscribe(response => this.equideList = response);
  }

  generateTypeSessionList() {
    this.client.get('http://' + environment.serverAddress + '/moniteur/liste-types-seances')
      .subscribe(response => this.typeSessionList = response);
  }

  generateTypeEquideList() {
    this.client.get('http://' + environment.serverAddress + '/moniteur/liste-types-equides')
      .subscribe(response => this.typeEquideList = response);
  }

  refreshSessionsList() {
    this.client.get("http://" + environment.serverAddress + "/moniteur/liste-seances")
      .subscribe(response => {
        this.sessionsList = response;
        this.sessionsList.forEach((seance: { id:any; commentaire: any; nombrePlaces: any; dateDebut: any; dateFin: any; typeSeance: any; }) => {
          this.events = [
            ...this.events,
            {
              id:seance.id,
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
      });

  }

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



eventClicked({ event }: { event: MyEvent }): void {
  this.session=event;
  // this.generateRegisteredRiders(this.session.id);
      this.client.get("http://" + environment.serverAddress + "/moniteur/reservation-par-seance/" + this.session.id)
    .subscribe((response: any) => {
      if(response.length!=0){
        // for(let i = 0; i <response.length; i++){
        //   UntypedFormGroup;
        //   `'attributionFormControl'+i` = this.formBuilder.group({
        //     "equide": ["", [Validators.required]]
        //   });
        
        this.reservations =response;
        this.containerAttributionHorse = 'visible';
        console.log(event.title, event);
      }else{
        this.alertVoidSession = 'visible';
      };
    })
  }
  // if(this.reservations!=null){
  //   this.containerAttributionHorse = 'visible';
  //   console.log(event.title, event);
  // }else{
  //   alert("- Aucune réservation -")
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
  // this.handleEvent('Dropped ou redimensionner', event);
}

  // handleEvent(action: string, event: MyEvent): void {
  //   this.modalData = { event, action };
  //   this.modal.open(this.modalContent, { size: 'lg' });
  // }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public exitNewSession() {
    this.containerAttributionHorse = "hidden";
  }

  addAttribution(){
    // if(this.attributionFormControl.valid){
      console.log("ok");
      this.containerAttributionHorse = "hidden";
      // this.attributionFormControl.reset();
    
  }

  exitBox(){
    this.containerAttributionHorse = "hidden";
  }

  generateRegisteredRiders(idSession:number){
    this.client.get("http://" + environment.serverAddress + "/moniteur/reservation-par-seance/" + idSession)
    .subscribe((response: any) => {
      if(response.length>0){
        this.reservations =response;
      }
        this.reservations =null;
        // this.registeredRiders = response;

    });
  }

  
  exitAlertVoidSession(){
    this.alertVoidSession = 'hidden';
  }
}

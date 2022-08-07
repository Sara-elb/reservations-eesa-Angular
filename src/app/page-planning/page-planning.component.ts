import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { Calendar, CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { createEventId, INITIAL_EVENTS } from '../event-utils';
// import { INITIAL_EVENTS, createEventId } from './event-utils';

import frLocale from '@fullcalendar/core/locales/fr';
import { CalendarEventTimesChangedEvent, CalendarEvent } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RidersData } from '../page-cavaliers/page-cavaliers.component';
import { TokenIdentificationService } from '../services/token-identification.service';

@Component({
  selector: 'app-page-planning',
  templateUrl: './page-planning.component.html',
  styleUrls: ['./page-planning.component.scss']
})

export class PagePlanningComponent implements OnInit {
public sessionFormControl: FormGroup = this.formBuilder.group({
  "date": ["", [Validators.required]],
  "duree": ["", [Validators.required]],
  "nbPlaces": ["", [Validators.required]],
  "categorie": ["", [Validators.required]],
  "niveaux": ["", [Validators.required]],
  "discipline": ["", [Validators.required]]
});

public events : any;
public session : any = null;
public levelsList: any;
public sessionTypeList : any;

public containerAddVisible = "visible";




  // calendar = new Calendar(calendarEl, {
  //   initialView: 'timeGrid',
  //   visibleRange: {
  //     start: '2020-03-22',
  //     end: '2020-03-25'
  //   }
  // });
  // events: any =[
  //   { title: 'event 1', date: '2019-04-01', color: '#0000FF' },
  //   { title: 'event 2', date: '2019-04-02' , color:'#FF0000'},
  //   { title: 'event 3', date: '2019-04-03', color: '#000FFF' },
  // ]


  // calendarOptions = {
  //   initialView: 'timeGrid',
  //      visibleRange: {
  //     start: '2020-03-22',
  //     end: '2020-03-25'
  //   }
  // };
  

  constructor(    
    private client: HttpClient,

    @Inject(FormBuilder)
    private formBuilder: FormBuilder,

    // private tokenIdentification: TokenIdentificationService,
    // private router: Router,

    ) { }

  ngOnInit(): void {
    // COULEUR DES SEANCES
    // this.events.forEach((element:{[x:string]:string}) => {
    //   element['color'] = '#556b2f';
      
    // });
    this.generateTypeLeveList();
    this.generateTypeSessionsList();
    this.refreshEventsList();


  }
  

  // private calendar: Calendar;
  evenement = [{ title: 'EVENEMENT', date: '2022-08-05 09:15:00', color: '#0000FF' },
  { title: 'EVENEMENT TEST', date: '2022-08-05 09:45:00', color: '#000080' },
  { title: 'TESTT', date: '2022-08-05 08:45:00', color: '#0000FF' }];
  
  
  locales = [frLocale];
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGrid',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    events: this.evenement,
    //   { title: 'event 1', date: '2021-08-04', color: '#0000FF'},
    //   { title: 'event 2', date: '2022-08-05 09:15:00', color: '#FF0000', backgroundColor:'#008080', borderColor:'000080'   },
    //   { title: 'test', date: '2022-08-05 09:15:00', color: '#FF0000', backgroundColor:'#839c49', borderColor:'000080'  },

    //   { title: 'event 3', date: '2022-08-06', color: '#000FFF' },
    // ],
              
    nowIndicator:true,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    dateClick:this.handleDateClick.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventResize:function(info){
      if(info.event.end!=null){
        alert(info.event.title + " end is now " + info.event.end.toISOString());

      }

      if (!confirm("is this okay?")) {
        info.revert();
      }
    },
  };

  //   eventChange({
  //   event,
  //   newStart,
  //   newEnd,
  //   }: CalendarEventTimesChangedEvent): void {
  //   this.events = this.events.map((iEvent) => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd,
  //       };
  //     }
  //     return iEvent;
  //   });
  //   this.handleEvent('Dropped or resized', event);
  // },

  // handleEvent(action: string, event: CalendarEvent): void {
  //   this.modalData = { event, action };
  //   this.modal.open(this.modalContent, { size: 'lg' });
  // }

    
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
 

  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt("Entrer le titre de l'évènement");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  // handleEventClick(clickInfo: EventClickArg) {
  //   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
  //     clickInfo.event.remove();
  //   }
  // }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  handleDateClick(arg:any){
    alert('date click! ' + arg.dateStr)

    console.log(arg);
    console.log(arg.event._def.title);
    // this.title
  }

  refreshEventsList() {
    this.client.get("http://" + environment.serverAddress + "/admin/liste-seances")
      .subscribe((response:any )=> {
        console.log(response[0]);
        // console.log(JSON.parse(response[0]))
        for(let i=0; i<response.length; i++){
          console.log("ok  "+i)
          // console.log(response[i].date);
          // var seance = { title: 'TEST', date: '2022-07-07', color: '#000080' };
          // Calendar.prototype.addEvent(seance);
          // this.calendarOptions.eventAdd(seance);
          //           console.log(response[i]);
          // { title: 'event 1', date: '2019-04-01', color: '#0000FF' },
          // const calendarApi = selectInfo.view.calendar;

          // Calendar.prototype.addEvent({
          //   id: createEventId(),
          //   start:'2022-07-19',
            
          // });

        }

        // this.events = JSON.parse(response);
      });
  }

  public exitNewSession() {
    this.containerAddVisible = "hidden";
  }

  public createSession(): void {
    if (this.sessionFormControl.valid) {
      console.log("ok fonction create rider");
      this.session = this.sessionFormControl.value;
      this.client.post("http://" + environment.serverAddress + "/admin/ajouter-seance", this.session)
        .subscribe((response: any) => {
          if (response.length == 2) {
            // this.alertAddNewRider = true;
            this.containerAddVisible = "hidden";
            // this.refreshRidersList();
            this.sessionFormControl.reset();
          } else {
            alert(response[0]);
            console.log(response[0]);
          }
        })
    }
  }

  generateTypeLeveList() {
    this.client.get('http://' + environment.serverAddress + '/admin/liste-niveaux')
      .subscribe(response => this.levelsList = response);
  }

  generateTypeSessionsList(){
    this.client.get('http://' + environment.serverAddress + '/admin/liste-types-seances')
      .subscribe(response => this.sessionTypeList = response);
  
  }
  
  

}



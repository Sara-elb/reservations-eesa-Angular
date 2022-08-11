import { Component, OnInit } from '@angular/core';
// import { startOfDay } from '@fullcalendar/angular';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import startOfDay from 'date-fns/startOfDay';

@Component({
  selector: 'app-espace-administrateur',
  templateUrl: './espace-administrateur.component.html',
  styleUrls: ['./espace-administrateur.component.scss']
})
export class EspaceAdministrateurComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  constructor() { }

  ngOnInit(): void {
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
    },
    {
      start: startOfDay(new Date()),
      title: 'Second event',
    }
  ]

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

dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  console.log(date);
  // this.openAppointmentList(date)
}
}

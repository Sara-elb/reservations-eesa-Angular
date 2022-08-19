import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageConnexionComponent } from './page-connexion/page-connexion.component';
import { PageCartesComponent } from './page-cartes/page-cartes.component';
import { PageCavaliersComponent } from './page-cavaliers/page-cavaliers.component';
import { EspaceAdministrateurComponent } from './espace-administrateur/espace-administrateur.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule} from "@angular/material/icon";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TokenInterceptor } from './services/token.interceptor';
import { MatInputModule } from '@angular/material/input';
import { CdkTableModule} from '@angular/cdk/table';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
// import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, CalendarUtils, DateAdapter } from 'angular-calendar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PageEquidesComponent } from './page-equides/page-equides.component';
// import { FullCalendarModule } from '@fullcalendar/angular';

// import { BootstrapModule } from './bootstrap.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { EspaceCavalierComponent } from './espace-cavalier/espace-cavalier.component';
import { HistoriqueReservationsComponent } from './historique-reservations/historique-reservations.component';
import * as moment from 'moment';
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { PageInformationsPersonnellesComponent } from './page-informations-personnelles/page-informations-personnelles.component';

import { NgPasswordValidatorModule, NgPasswordValidatorOptions } from "ng-password-validator";

registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

@NgModule({
  declarations: [
    AppComponent,
    PageConnexionComponent,
    PageCartesComponent,
    PageCavaliersComponent,
    EspaceAdministrateurComponent,
    PageEquidesComponent,
    EspaceCavalierComponent,
    HistoriqueReservationsComponent,
    PageInformationsPersonnellesComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    CdkTableModule,
    MatSelectModule,
    NgbModule,
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, 
    MatDatepickerModule,DatePipe,],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }

export const MyDefaultOptions: NgPasswordValidatorOptions = {
  placement: "right",
  rules: {
      'password': {
          'type': "range",
          'min': 6,
          'max': 10,
      },
      "include-symbol": true,
      "include-number": false,
      "include-lowercase-characters": true,
      "include-uppercase-characters": false,
  }
};


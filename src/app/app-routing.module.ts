import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspaceAdministrateurComponent } from './espace-administrateur/espace-administrateur.component';
import { PageCartesComponent } from './page-cartes/page-cartes.component';
import { PageCavaliersComponent } from './page-cavaliers/page-cavaliers.component';
import { PageConnexionComponent } from './page-connexion/page-connexion.component';
import { PlanningReservationsComponent } from './planning-reservations/planning-reservations.component';
import { AdminGuard } from './services/admin.guard';

const routes: Routes = [
  {path:'', component: PageConnexionComponent},
  // {path:'connexion', component: PageConnexionComponent},
  {path:'espace-administrateur/gestion-des-cavaliers', component: PageCavaliersComponent},
  {path:'espace-administrateur/gestion-des-cartes', component: PageCartesComponent, canActivate : [AdminGuard]},
  {path:'espace-administrateur', component: EspaceAdministrateurComponent, canActivate : [AdminGuard]},
  {path:'espace-cavalier', component: PlanningReservationsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

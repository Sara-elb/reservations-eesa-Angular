import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspaceAdministrateurComponent } from './espace-administrateur/espace-administrateur.component';
import { EspaceCavalierComponent } from './espace-cavalier/espace-cavalier.component';
import { HistoriqueReservationsComponent } from './historique-reservations/historique-reservations.component';
import { PageCartesComponent } from './page-cartes/page-cartes.component';
import { PageCavaliersComponent } from './page-cavaliers/page-cavaliers.component';
import { PageConnexionComponent } from './page-connexion/page-connexion.component';
import { PageEquidesComponent } from './page-equides/page-equides.component';
import { PageInformationsPersonnellesComponent } from './page-informations-personnelles/page-informations-personnelles.component';
import { AdminGuard } from './services/admin.guard';

const routes: Routes = [
  {path:'', component: PageConnexionComponent},
  {path:'espace-administrateur/gestion-des-equides', component: PageEquidesComponent},
  {path:'espace-administrateur/gestion-des-cavaliers', component: PageCavaliersComponent},
  {path:'espace-administrateur/gestion-des-cartes', component: PageCartesComponent, canActivate : [AdminGuard]},
  {path:'espace-administrateur', component: EspaceAdministrateurComponent, canActivate : [AdminGuard]},
  {path:'espace-cavalier', component: EspaceCavalierComponent},
  // {path:'planning', component: PagePlanningComponent},
  {path:'espace-cavalier/historique-reservations', component: HistoriqueReservationsComponent},
  {path:'espace-cavalier/informations-personnelles', component: PageInformationsPersonnellesComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

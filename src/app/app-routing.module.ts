import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspaceAdministrateurComponent } from './espace-administrateur/espace-administrateur.component';
import { PageCartesComponent } from './page-cartes/page-cartes.component';
import { PageCavaliersComponent } from './page-cavaliers/page-cavaliers.component';
import { PageConnexionComponent } from './page-connexion/page-connexion.component';

const routes: Routes = [
  {path:'connexion', component: PageConnexionComponent},
  {path:'espace-administrateur/gestion-des-cavaliers', component: PageCavaliersComponent},
  {path:'espace-administrateur/gestion-des-cartes', component: PageCartesComponent},
  {path:'espace-administrateur', component: EspaceAdministrateurComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

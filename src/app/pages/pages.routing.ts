import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenedor/usuarios/usuarios.component';
import { MedicosComponent } from './mantenedor/medicos/medicos.component';
import { HospitalesComponent } from './mantenedor/hospitales/hospitales.component';



const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
            // Dashboard
            { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' }},
            { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1' }},
            { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' }},
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' }},
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' }},
            { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de Usuario' }},

            // Mantenedor
            { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios de aplicación' }},
            { path: 'medicos', component: MedicosComponent, data: { titulo: 'Medicos' }},
            { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Hospitales' }},


        ]
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}



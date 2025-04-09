import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomePage } from './home/home.page';
import { SignupComponent } from './signup/signup.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ServicesComponent } from './services/services.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { ERPComponent } from './erp/erp.component';
import { CRMComponent } from './crm/crm.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RegisterComponent } from './register/register.component';
import { EmplistComponent } from './emplist/emplist.component';
import { SampleformComponent } from './sampleform/sampleform.component';
import { MatformComponent } from './matform/matform.component';
import { MatComponent } from './mat/mat.component';
import { SliderComponent } from './slider/slider.component';
import { MenuGroupComponent } from './menu-group/menu-group.component';
import { MenuPopupComponent } from './menu-popup/menu-popup.component';
import { AssetformComponent } from './assetform/assetform.component';
import { MenuGroupPopComponent } from './menu-group-edit/menu-group-pop.component';
import { MenuGroupSaveComponent } from './menu-group-save/menu-group-save.component';
import { MenuPopupSaveComponent } from './menu-popup-save/menu-popup-save.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Main Layout as Parent
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePage },
      { path: 'about', component: AboutusComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'services', component: ServicesComponent },


    ],
  },
  { path: 'erp', component: ERPComponent },
  { path: 'crm', component: CRMComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'emplist', component: EmplistComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sampleform', component: SampleformComponent },
  { path: 'matform', component: MatformComponent },
  { path: 'mat', component: MatComponent },
  { path: 'slider', component: SliderComponent },
  { path: 'menu-group', component: MenuGroupComponent },
  { path: 'menu-group-pop', component: MenuGroupPopComponent },
  { path: 'menu-popup', component: MenuPopupComponent },
  { path: 'assetform', component: AssetformComponent },
  { path: 'menu-group-save', component: MenuGroupSaveComponent },
  { path: 'menu-popup-save', component: MenuPopupSaveComponent },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

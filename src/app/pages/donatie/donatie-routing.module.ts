import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonatiePage } from './donatie.page';


const routes: Routes = [
  {
    path: '',
    component: DonatiePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonatiePageRoutingModule {}

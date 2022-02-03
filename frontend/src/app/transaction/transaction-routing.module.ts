import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
const routes: Routes = [
  { path: 'transaction/index', redirectTo: 'transaction', pathMatch: 'full'},
  { path: 'transaction', component: IndexComponent },
  { path: 'transaction/create', component: CreateComponent },
  { path: 'transaction/:id/edit', component: EditComponent },
  {path:'**', redirectTo: 'transaction'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionRoutingModule } from './transaction-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class TransactionModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NewsComponent } from './news/news.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [NewsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PaginationModule.forRoot(),
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }

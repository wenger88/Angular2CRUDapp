import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders } from './app.routing';

import { AppComponent }   from './app.component';

import { SharedModule } from './shared';
import {
	DatepickerModule, Ng2BootstrapModule, ModalModule, ProgressbarModule, PaginationModule,
	TimepickerModule
} from "ng2-bootstrap";

import {HomeComponent} from "./home/home.component";
import {DateFormatPipe} from "./shared/pipes/date-format.pipe";
import {HighlightDirective} from "./shared/directives/highlight.directive";
import {MobileHideDirective} from "./shared/directives/mobile-hide.directive";
import {ScheduleListComponent} from "./schedules/schedule-list.component";
import {DataService} from "./shared/services/data.service";
import {NotificationService} from "./shared/utils/notification.service";
import {MappingService} from "./shared/utils/mapping.service";
import {ItemsService} from "./shared/utils/items.service";
import {ConfigService} from "./shared/utils/config.service";
import {ScheduleEditComponent} from "./schedules/schedule-edit.component";
import {UserCardComponent} from "./users/user-card.component";
import {UserListComponent} from "./users/user-list.component";

@NgModule({
	imports: [
		FormsModule,
		HttpModule,
		BrowserModule,		
		SharedModule,
		routing,
		DatepickerModule,
		Ng2BootstrapModule,
		ModalModule,
		ProgressbarModule,
		PaginationModule,
		TimepickerModule
	],
	declarations: [
        AppComponent,
        DateFormatPipe,
        HighlightDirective,
        HomeComponent,
        MobileHideDirective,
        ScheduleListComponent,
        ScheduleEditComponent,
        UserCardComponent,
        UserListComponent


	],
	providers: [
		appRoutingProviders,
        ConfigService,
        DataService,
        ItemsService,
        MappingService,
        NotificationService
	], 
	exports: [],
	bootstrap: [AppComponent],
})

export class AppModule {}

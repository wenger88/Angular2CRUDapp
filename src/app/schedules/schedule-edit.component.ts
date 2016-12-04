/**
 * Created by Goran on 12/4/2016.
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { MappingService } from '../shared/utils/mapping.service';
import { Schedule, ScheduleDetails, User } from '../shared/interfaces';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';

@Component({
    selector: 'app-schedule-edit',
    template: require('./schedule-edit.component.html'),
    styles: [require('./schedule-edit.component.scss')]
})
export class ScheduleEditComponent implements OnInit {
    apiHost: string;
    id: number;
    schedule: ScheduleDetails;
    scheduleLoaded: boolean = false;
    statuses: string[];
    types: string[];
    private sub: any;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private dataService: DataService,
                private itemsService: ItemsService,
                private notificationService: NotificationService,
                private configService: ConfigService,
                private mappingService: MappingService) { }

    ngOnInit() {
        // (+) converts string 'id' to a number
        this.id = +this.route.snapshot.params['id'];
        this.apiHost = this.configService.getApiHost();
        this.loadScheduleDetails();
    }

    loadScheduleDetails() {
        //this.slimLoader.start();
        this.dataService.getScheduleDetails(this.id)
            .subscribe((schedule: ScheduleDetails) => {
                    this.schedule = this.itemsService.getSerialized<ScheduleDetails>(schedule);
                    this.scheduleLoaded = true;
                    // Convert date times to readable format
                    this.schedule.timeStart = new Date(this.schedule.timeStart.toString()); // new DateFormatPipe().transform(schedule.timeStart, ['local']);
                    this.schedule.timeEnd = new Date(this.schedule.timeEnd.toString()); //new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                    this.statuses = this.schedule.statuses;
                    this.types = this.schedule.types;

                    //this.slimLoader.complete();
                },
                error => {
                    //this.slimLoader.complete();
                    this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
                });
    }

    updateSchedule(editScheduleForm: NgForm) {
        console.log(editScheduleForm.value);

        var scheduleMapped = this.mappingService.mapScheduleDetailsToSchedule(this.schedule);

        //this.slimLoader.start();
        this.dataService.updateSchedule(scheduleMapped)
            .subscribe(() => {
                    this.notificationService.printSuccessMessage('Schedule has been updated');
                    //this.slimLoader.complete();
                },
                error => {
                    //this.slimLoader.complete();
                    this.notificationService.printErrorMessage('Failed to update schedule. ' + error);
                });
    }

    removeAttendee(attendee: User) {
        this.notificationService.openConfirmationDialog('Are you sure you want to remove '
            + attendee.name + ' from this schedule?',
            () => {
                //this.slimLoader.start();
                this.dataService.deleteScheduleAttendee(this.schedule.id, attendee.id)
                    .subscribe(() => {
                            this.itemsService.removeItemFromArray<User>(this.schedule.attendees, attendee);
                            this.notificationService.printSuccessMessage(attendee.name + ' will not attend the schedule.');
                            //this.slimLoader.complete();
                        },
                        error => {
                            //this.slimLoader.complete();
                            this.notificationService.printErrorMessage('Failed to remove ' + attendee.name + ' ' + error);
                        });
            });
    }

    back() {
        this.router.navigate(['/schedules']);
    }

}
/**
 * Created by Goran on 12/4/2016.
 */
import {DataService} from "../shared/services/data.service";

import {Component, OnInit, ViewChild, style, animate, transition, state, trigger} from "@angular/core";
import {ModalDirective, ComponentsHelper} from "ng2-bootstrap";
import {Schedule, ScheduleDetails, PaginatedResult} from "../shared/interfaces";
import {DateFormatPipe} from "../shared/pipes/date-format.pipe";
import {ConfigService} from "../shared/utils/config.service";
import {NotificationService} from "../shared/utils/notification.service";
import {ItemsService} from "../shared/utils/items.service";
ComponentsHelper.prototype.getRootViewContainerRef = function () {
    // https://github.com/angular/angular/issues/9293
    if (this.root) {
        return this.root;
    }
    var comps = this.applicationRef.components;
    if (!comps.length) {
        throw new Error("ApplicationRef instance not found");
    }
    try {
        /* one more ugly hack, read issue above for details */
        var rootComponent = this.applicationRef._rootComponents[0];
        //this.root = rootComponent._hostElement.vcRef;
        this.root = rootComponent._component.viewContainerRef;
        return this.root;
    }
    catch (e) {
        throw new Error("ApplicationRef instance not found");
    }
};
@Component({
    selector: 'app-schedules',
    template: require('./schedule-list.component.html'),
    styles: [require('./schedule-list.component.scss')],
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.5s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})

export class ScheduleListComponent implements OnInit{

    @ViewChild('childModal') public childModal: ModalDirective;
    schedules: Schedule[];
    apiHost: string;

    public itemsPerPage: number = 2;
    public totalItems: number = 0;
    public currentPage: number = 1;

    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedScheduleId: number;
    scheduleDetails: ScheduleDetails;
    selectedScheduleLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;

    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService) { }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.loadSchedules();
    }

    loadSchedules() {
        //this.loadingBarService.start();

        this.dataService.getSchedules(this.currentPage, this.itemsPerPage)
            .subscribe((res: PaginatedResult<Schedule[]>) => {
                    this.schedules = res.result;// schedules;
                    this.totalItems = res.pagination.TotalItems;
                    //this.loadingBarService.complete();
                },
                error => {
                    //this.loadingBarService.complete();
                    this.notificationService.printErrorMessage('Failed to load schedules. ' + error);
                });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        this.loadSchedules();
        //console.log('Page changed to: ' + event.page);
        //console.log('Number items per page: ' + event.itemsPerPage);
    };

    removeSchedule(schedule: Schedule) {
        this.notificationService.openConfirmationDialog('Are you sure you want to delete this schedule?',
            () => {
                //this.loadingBarService.start();
                this.dataService.deleteSchedule(schedule.id)
                    .subscribe(() => {
                            this.itemsService.removeItemFromArray<Schedule>(this.schedules, schedule);
                            this.notificationService.printSuccessMessage(schedule.title + ' has been deleted.');
                            //this.loadingBarService.complete();
                        },
                        error => {
                            //this.loadingBarService.complete();
                            this.notificationService.printErrorMessage('Failed to delete ' + schedule.title + ' ' + error);
                        });
            });
    }

    viewScheduleDetails(id: number) {
        this.selectedScheduleId = id;

        this.dataService.getScheduleDetails(this.selectedScheduleId)
            .subscribe((schedule: ScheduleDetails) => {
                    this.scheduleDetails = this.itemsService.getSerialized<ScheduleDetails>(schedule);
                    // Convert date times to readable format
                    this.scheduleDetails.timeStart = new DateFormatPipe().transform(schedule.timeStart, ['local']);
                    this.scheduleDetails.timeEnd = new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                    //this.slimLoader.complete();
                    this.selectedScheduleLoaded = true;
                    this.childModal.show();//.open('lg');
                },
                error => {
                    //this.slimLoader.complete();
                    this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
                });
    }

    public hideChildModal(): void {
        this.childModal.hide();
    }

}
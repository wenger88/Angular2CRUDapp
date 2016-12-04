/**
 * Created by Goran on 12/4/2016.
 */

import { Injectable } from '@angular/core';

import { Schedule, ScheduleDetails, User } from '../interfaces';
import  { ItemsService } from './items.service'

@Injectable()
export class MappingService {

    constructor(private itemsService : ItemsService) { }

    mapScheduleDetailsToSchedule(scheduleDetails: ScheduleDetails): Schedule {
        var schedule: Schedule = {
            id: scheduleDetails.id,
            title: scheduleDetails.title,
            description: scheduleDetails.description,
            timeStart: scheduleDetails.timeStart,
            timeEnd: scheduleDetails.timeEnd,
            location: scheduleDetails.location,
            type: scheduleDetails.type,
            status: scheduleDetails.status,
            dateCreated: scheduleDetails.dateCreated,
            dateUpdated: scheduleDetails.dateUpdated,
            creator: scheduleDetails.creator,
            creatorId: scheduleDetails.creatorId,
            attendees: this.itemsService.getPropertyValues<User, number[]>(scheduleDetails.attendees, 'id')
        }

        return schedule;
    }

}
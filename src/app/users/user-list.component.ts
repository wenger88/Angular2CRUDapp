/**
 * Created by Goran on 12/4/2016.
 */

import { Component, OnInit } from '@angular/core';

import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { User } from '../shared/interfaces';
import { UserCardComponent } from './user-card.component';

@Component({
    selector: 'users',
    template: require('./user-list.component.html'),
    styles: [require('./user-list.component.scss')]
})
export class UserListComponent implements OnInit {

    users: User[];
    addingUser: boolean = false;

    constructor(private dataService: DataService,
                private itemsService: ItemsService,
                private notificationService: NotificationService) { }

    ngOnInit() {
        this.dataService.getUsers()
            .subscribe((users: User[]) => {
                    this.users = users;
                },
                error => {
                    this.notificationService.printErrorMessage('Failed to load users. ' + error);
                });
    }

    removeUser(user: any) {
        var _user: User = this.itemsService.getSerialized<User>(user.value);
        this.itemsService.removeItemFromArray<User>(this.users, _user);
        // inform user
        this.notificationService.printSuccessMessage(_user.name + ' has been removed');
    }

    userCreated(user: any) {
        var _user: User = this.itemsService.getSerialized<User>(user.value);
        this.addingUser = false;
        // inform user
        this.notificationService.printSuccessMessage(_user.name + ' has been created');
        console.log(_user.id);
        this.itemsService.setItem<User>(this.users, (u) => u.id == -1, _user);
        // todo fix user with id:-1
    }

    addUser() {
        this.addingUser = true;
        var newUser = { id: -1, name: '', avatar: 'avatar_05.png', profession: '', schedulesCreated: 0 };
        this.itemsService.addItemToStart<User>(this.users, newUser);
        //this.users.splice(0, 0, newUser);
    }

    cancelAddUser() {
        this.addingUser = false;
        this.itemsService.removeItems<User>(this.users, x => x.id < 0);
    }
}
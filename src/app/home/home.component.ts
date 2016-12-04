/**
 * Created by Goran on 12/4/2016.
 */


import {Component, trigger, state, style, transition, animate} from "@angular/core";
@Component({
    selector: 'home',
    template: require('./home.component.html'),
    styles: [require('./home.component.scss')],
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.6s ease-in')
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

export class HomeComponent{
    constructor(){}
}
import {Component, ViewContainerRef} from '@angular/core';

import '../../public/scss/styles.scss';

@Component({
	selector: 'scheduler',
	template: require('./app.component.html'),
	styles: [require('./app.component.scss')]
})

export class AppComponent {

	constructor(private viewContainerRef: ViewContainerRef){
		this.viewContainerRef = viewContainerRef;
	}

}

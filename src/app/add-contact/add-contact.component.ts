import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

  @Input('display') displayDialog: boolean = false;
  @Input('modify') modify: string = 'add';
  @Output() returnData = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log("add-contact-component.ts: ngOnInit()");
    // console.log("displayDialog: " + this.displayDialog + " modify: " + this.modify);
  }

  ngOnChanges() {
    console.log("add-contact-component.ts: ngOnChanges()");
    // console.log("displayDialog: " + this.displayDialog + " modify: " + this.modify);
  }

  onDialogHide($event, dialog: Dialog) {
    console.log("add-contact-component.ts: onDialogHide()");
    let data = { 'retVal' : 0 };
    this.returnData.emit(data);
  }
  
  onDialogShow($event, dialog: Dialog) {
    console.log("add-contact-component.ts: onDialogHide()");
  }
}
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

  @Input('display') displayDialog: boolean = false;
  @Input('modify') modify: string = 'add';

  constructor() { }

  ngOnInit() {
    console.log("add-contact-component.ts: ngOnInit() displayDialog: " + this.displayDialog + " modify: " + this.modify);
  }

  ngOnChanges() {
    console.log("add-contact-component.ts: ngOnChanges() displayDialog: " + this.displayDialog + " modify: " + this.modify);
  }
}

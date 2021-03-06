import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'Contacts';
  displayContactDialog: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  addContact() {
    console.log('add-contact requested');
    this.displayContactDialog = true;
  }

  onDialogClose($event) {
    console.log('header-component.ts onDialogClose()');
    console.log($event);
    this.displayContactDialog = false;
  }
}

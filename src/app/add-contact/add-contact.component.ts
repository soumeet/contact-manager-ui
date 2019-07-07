import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { Dialog } from 'primeng/dialog';
import { SelectItem } from 'primeng/components/common/selectitem';

import { BaseService } from '../services/base.service';
import { HttpService } from '../services/http.service';

@Component({
    selector: 'app-add-contact',
    templateUrl: './add-contact.component.html',
    styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

    @Input('display') displayDialog: boolean = false;
    @Input('modify') modify: string = 'add';
    @Output() returnData = new EventEmitter();

    expandNames: boolean = false;

    emailTypes: SelectItem[];
    phoneTypes: SelectItem[];
    countryCodes: SelectItem[];
    availableLabels: string[];
    selectedEmailType: string;
    selectedPhoneType: string;
    selectedCountryCode: string;
    selectedLabels: string[];
    blockSpace: RegExp = /[^\s]/; 

    countryData: any[];
    filteredLabelsMultiple: any[];

    contactForm: FormGroup;
    emails: FormArray;
    phones: FormArray;
    labels: FormArray;

    constructor(private formBuilder: FormBuilder, private baseService: BaseService, private httpService: HttpService) {
        this.contactForm =  this.formBuilder.group({
            suffix: new FormControl('', ),
            firstName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
            middleName: new FormControl('', ),
            lastName: new FormControl('', [Validators.maxLength(10)]),
            company: new FormControl('', [Validators.required, Validators.minLength(1)]),
            emails: this.formBuilder.array([this.createEmail()]),
            phones: this.formBuilder.array([this.createPhone()]),
            labels: new FormControl('', )
        });
        this.emailTypes = [
            {label: 'Home', value: 'HOME'},
            {label: 'Work', value: 'WORK'},
            {label: 'Other', value: 'OTHER'}
        ];
        this.phoneTypes = [
            {label: 'Home', value: 'HOME'},
            {label: 'Work', value: 'WORK'},
            {label: 'Other', value: 'OTHER'}
        ];
        this.countryCodes = [];
        this.countryData = [];
        this.baseService.getLabels().then(lbls => {
            //console.log(lbls);
            this.availableLabels = lbls;
        });

        if(window.sessionStorage.getItem('countryData') != null){
            //console.log(window.sessionStorage.getItem('countryData'));
            this.countryData = JSON.parse(window.sessionStorage.getItem('countryData'));
            this.loadCountryCodesFromSession();
        }
        else{
            this.httpService.getCountryCodes().then( data => {
                for(let i of data) {
                    if (i['callingCodes'][0] != '')
                        this.countryData.push({
                            'alpha3Code': i['alpha3Code'],
                            'name': i['name'],
                            'callingCode': i['callingCodes'][0]
                        });
                }
                window.sessionStorage.setItem('countryData', JSON.stringify(this.countryData));
                this.loadCountryCodesFromSession();
            });
        }
    }

    ngOnInit() {
        console.log("add-contact-component.ts: ngOnInit()");
        // console.log("displayDialog: " + this.displayDialog + " modify: " + this.modify);
    }

    ngOnChanges() {
        console.log("add-contact-component.ts: ngOnChanges()");
        // console.log("displayDialog: " + this.displayDialog + " modify: " + this.modify);
    }

    loadCountryCodesFromSession(): void {
        for(let i of this.countryData){
            this.countryCodes.push(
                { label: i['alpha3Code'] + ' ' +  i['callingCode'], value: i['callingCode'] },
            );
        }
    }

    onDialogHide($event, dialog: Dialog) {
        console.log("add-contact-component.ts: onDialogHide()");
        let data = { 'retVal' : 0 };
        this.returnData.emit(data);
    }
    
    onDialogShow($event, dialog: Dialog) {
        console.log("add-contact-component.ts: onDialogHide()");
        //console.log(dialog);
    }

    filterLabelMultiple(event) {
        let query = event.query;
        this.filteredLabelsMultiple = this.filterLabel(query, this.availableLabels);
    }

    filterLabel(query, labels: any[]):any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        for(let i = 0; i < labels.length; i++) {
            let label = labels[i];
            if(label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(label);
            }
        }
        filtered.push(query);
        return filtered;
    }

    onSubmit(contactFormValue: any) {
        console.log('onSubmit()', contactFormValue);
    }

    createEmail(): FormGroup {
        return this.formBuilder.group({
            emailId: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
            emailType: new FormControl('', [Validators.minLength(1), Validators.maxLength(10)]),
        });
    }

    addEmail(index: any): void {
        console.log('addEmail()', index);
        this.emails = this.contactForm.get('emails') as FormArray;
        this.emails.push(this.createEmail());
    }

    removeEmail(index: any) {
        console.log('removeEmail()', index);
        console.log(this.emails);
        this.emails.removeAt(index - 1);
    }

    createPhone(): FormGroup {
        return this.formBuilder.group({
            phoneCode: new FormControl('', [Validators.maxLength(5)]),
            phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
            phoneType: new FormControl('', [Validators.minLength(1), Validators.maxLength(10)]),
        });
    }

    addPhone(): void {
        this.phones = this.contactForm.get('phones') as FormArray;
        this.phones.push(this.createPhone());
    }

    removePhone(formGroup: FormGroup) {
        // this.contactForm.
    }

    onCancel($event, dialog: Dialog): void {
        console.log('onCancel()');
        this.onDialogHide(event, dialog);
    }
}
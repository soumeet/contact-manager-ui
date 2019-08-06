import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, NgForm, ValidatorFn, ValidationErrors } from '@angular/forms';

import { Dialog } from 'primeng/dialog';
import { SelectItem } from 'primeng/components/common/selectitem';
import { MessageService } from 'primeng/api';

import { BaseService } from '../services/base.service';
import { HttpService } from '../services/http.service';
import { ContactService } from '../services/contact.service';
import { PhoneService } from '../services/phone.service';
import { EmailService } from '../services/email.service';

@Component({
    selector: 'app-add-contact',
    templateUrl: './add-contact.component.html',
    styleUrls: ['./add-contact.component.css'],
    providers: [MessageService]
})
export class AddContactComponent implements OnInit {

    @Input('display') displayDialog: boolean = false;
    @Input('modify') modify: string = 'add';
    @Output() returnData = new EventEmitter();

    expandNames: boolean = false;

    emailTypes: SelectItem[];
    phoneTypes: SelectItem[];
    addressTypes: SelectItem[];
    countryCodes: SelectItem[];
    countries: SelectItem[];
    availableLabels: string[];
    selectedEmailType: string;
    selectedPhoneType: string;
    selectedCountryCode: string;
    selectedLabels: string[];
    
    countryData: any[];
    filteredLabelsMultiple: any[];
    
    contactForm: FormGroup;
    emails: FormArray;
    phones: FormArray;
    addresses: FormArray;
    labels: FormArray;
    
    emailPattern: RegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    phonePattern: RegExp = /^\d{10}$/;
    blockSpace: RegExp = /[^\s]/; 

    constructor(private formBuilder: FormBuilder, 
        private baseService: BaseService, 
        private httpService: HttpService,
        private contactService: ContactService,
        private phoneService: PhoneService,
        private emailService: EmailService,
        private messageService: MessageService) {
        this.contactForm =  this.formBuilder.group({
            suffix: new FormControl('', ),
            firstName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
            middleName: new FormControl('', ),
            lastName: new FormControl('', [Validators.maxLength(10)]),
            company: new FormControl(''),
            emails: this.formBuilder.array([this.createEmail()]),
            phones: this.formBuilder.array([this.createPhone()]),
            addresses: this.formBuilder.array([this.createAddress()]),
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
        this.addressTypes = [
            {label: 'Home', value: 'HOME'},
            {label: 'Work', value: 'WORK'},
            {label: 'Other', value: 'OTHER'}
        ];
        this.countryCodes = [];
        this.countries = [];
        this.countryData = [];
        this.baseService.getLabels().then(lbls => {
            //console.log(lbls);
            this.availableLabels = lbls;
        });

        if(window.sessionStorage.getItem('countryData') != null){
            //console.log(window.sessionStorage.getItem('countryData'));
            this.countryData = JSON.parse(window.sessionStorage.getItem('countryData'));
            this.loadFromSession();
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
                this.loadFromSession();
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

    loadFromSession(): void {
        for(let i of this.countryData){
            this.countryCodes.push(
                { label: i['alpha3Code'] + ' ' +  i['callingCode'], value: i['callingCode'] },
            );
            this.countries.push(
                { label: i['name'], value: i['name'] },
            );
        }
    }

    onDialogHide() {
        console.log("add-contact-component.ts: onDialogHide()");
        let data = { 'retVal' : 0 };
        this.returnData.emit(data);
    }
    
    onDialogShow() {
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

    createEmail(): FormGroup {
        return this.formBuilder.group({
            emailId: new FormControl('', [
                Validators.required, 
                Validators.maxLength(50), 
                Validators.pattern(this.emailPattern),
                this.duplicateCheckValidator
            ]),
            emailType: new FormControl('OTHER', [
                Validators.required, 
                Validators.minLength(1), 
                Validators.maxLength(10)]),
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
            phoneCode: new FormControl('', [
                Validators.maxLength(5)
            ]),
            phoneNumber: new FormControl('', [
                Validators.required, 
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern(this.phonePattern),
                this.duplicateCheckValidator    
            ]),
            phoneType: new FormControl('OTHER', Validators.compose([
                Validators.required,
                Validators.maxLength(10)
            ])),
        });
    }

    addPhone(): void {
        this.phones = this.contactForm.get('phones') as FormArray;
        this.phones.push(this.createPhone());
    }

    removePhone(index: number) {
        console.log('removePhone()', index);
    }

    createAddress(): FormGroup {
        return this.formBuilder.group({
            houseno: new FormControl('', [
                Validators.maxLength(200)
            ]),
            street: new FormControl('', [
                Validators.maxLength(200)
            ]),
            locality: new FormControl('', [
                Validators.maxLength(200)
            ]),
            city: new FormControl('', Validators.compose([
                Validators.required,
                Validators.maxLength(50)
            ])),
            pincode: new FormControl('', [
                Validators.maxLength(6)
            ]),
            country: new FormControl('', [
                Validators.maxLength(50)
            ]),
            addressType: new FormControl('OTHER', Validators.compose([
                Validators.required,
                Validators.maxLength(10)
            ])),
        });
    }

    addAddress(): void {
        this.addresses = this.contactForm.get('addresses') as FormArray;
        this.addresses.push(this.createAddress());
    }

    removeAddress(index: number) {
        console.log('removeAddress()', index);
    }    

    onSubmit(contactForm: FormGroup): void {
        console.log('onSubmit()');
        console.log(JSON.stringify(contactForm.value));
        // let res = this.save(contactForm.value);
    }

    onCancel(dialog: Dialog): void {
        console.log('onCancel()');
        this.onDialogHide();
    }

    toggleExpand(): void {
        if (this.expandNames)
            this.expandNames = false;
        else
            this.expandNames = true;
    }

    getErrors(field: any): string {
        let msg: string = '';
        console.log(field);
        return msg;
    }

    getTooltipText(index: number, formgroup: string, formcontrol: string): string {
        let text: string = '';
        if ((this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('required'))
            text = 'Required';
        else if ((this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('minlength'))
            text = 'Length less than ' + ((this.contactForm.get(formgroup) as FormArray).at(index).get(formcontrol).getError('minlength').requiredLength); 
        else if ((this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('maxlength'))
            text = 'Length more than ' + ((this.contactForm.get(formgroup) as FormArray).at(index).get(formcontrol).getError('maxlength').requiredLength);
        else if ((this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('pattern'))
            text = 'Invalid Format';
        else if ((this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('duplicate-check'))
            text = ((this.contactForm.get(formgroup) as FormArray).at(index).get(formcontrol).getError('duplicate-check'));
        else
            text = 'Valid';
        // console.log(formgroup, index, formcontrol, text);
        return text;
    }

    log(field: any): void {
        console.log(field);
    }

    save(contactFormValue: any): any {
        return this.contactService.addContact(contactFormValue);
    }

    /*ADDS DUPLICATE-CHECK FLAG*/
    duplicateCheckValidator(): ValidationErrors {
        return {'duplicate-check': 'Requires Validation' };
    }
    

    /*VALIDATES PHONE-NUMBER FROM DATABASE*/
    checkExisting(index: number, formgroup: string, formcontrol: string) {
        if(
            !(this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('required') &&
            !(this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('minlength') &&
            !(this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('maxlength') &&
            !(this.contactForm.get(formgroup)as FormArray).at(index).get(formcontrol).hasError('pattern')
        ) {
            if ((this.contactForm.get(formgroup) as FormArray).at(index).get(formcontrol).hasError('duplicate-check')) {
                let value = ((this.contactForm.get(formgroup) as FormArray).at(index).get(formcontrol).value);
                // console.log('checkExisting-' + formcontrol, value );
                this.getCheckExistingSubscription(formgroup, value)
                .subscribe( response => {
                    console.log(response); 
                    if (response == '0') {
                        (this.contactForm.get(formgroup) as FormArray).at(index).get(formcontrol).setErrors(null);
                        let field = formcontrol == 'phoneNumber' ? 'Phone Number' : 'Email ID';
                        this.showMessage('success', field, 'Available');
                    }
                    else {
                        (this.contactForm.get(formgroup) as FormArray).at(index).get(formcontrol).setErrors({
                            'duplicate-check': 'Already Exists'
                        });
                        let field = formcontrol == 'phoneNumber' ? 'Phone Number' : 'Email ID';
                        this.showMessage('error', field, 'Not Available');
                    }
                });
            }
        }
    }

    getCheckExistingSubscription(field: string, value: string) {
        if( field == 'phones')
            return this.phoneService.validatePhoneNumber(value);
        else if( field == 'emails')
            return this.emailService.validateEmailId(value);
    }

    showMessage(type: string, summary: string, detail: string) {
        this.messageService.add({severity: type, summary: summary, detail: detail});
    }
}
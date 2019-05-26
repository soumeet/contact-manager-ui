import { Address } from "./address";
import { Photo } from "./photo";
import { Phone } from "./phone";
import { Email } from "./email";

export interface Contact {
    contactId: number;
	company: string;
	firstName: string;
	lastName: string;
	middleName: string;
	suffix: string;
    phones: Phone[];
    emails: Email[];
	addresses: Address[];
	photo: Photo;
}
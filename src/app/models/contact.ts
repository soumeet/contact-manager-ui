import { Address } from "./address";
import { Photo } from "./photo";
import { Phone } from "./phone";
import { Email } from "./email";

export interface Contact {
    contactId: number;
	company: string;
	suffix: string;
	firstName: string;
	lastName: string;
	middleName: string;
    phones: Phone[];
    emails: Email[];
	addresses: Address[];
	photo: Photo;
	labels: string[];
}
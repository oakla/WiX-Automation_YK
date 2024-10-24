import { Permissions, webMethod } from "wix-web-module";
import { contacts } from "wix-crm-backend";

export const myGetContactFunction = webMethod(Permissions.Anyone, () => {
  const contactId = "bc0ae72b-3285-485b-b0ad-c32c769a4daf";
  const options = {
    suppressAuth: false,
  };

  return contacts
    .getContact(contactId, options)
    .then((contact) => {
      return contact;
    })
    .catch((error) => {
      console.error(error);
    });
});

/* Promise resolves to:
 * {
 *   "_id": "bc0ae72b-3285-485b-b0ad-c32c769a4daf",
 *   "_createdDate": "2021-03-30T13:12:39.650Z",
 *   "_updatedDate": "2021-03-30T13:12:39.650Z",
 *   "revision": 0,
 *   "info": {
 *     "name": {
 *       "first": "Gene",
 *       "last": "Lopez"
 *     },
 *     "birthdate": "1981-11-02",
 *     "company": "Borer and Sons, Attorneys at Law",
 *     "jobTitle": "Senior Staff Attorney",
 *     "labelKeys": [
 *       "custom.white-glove-treatment",
 *       "contacts.contacted-me",
 *       "custom.new-lead"
 *     ],
 *     "locale": "en-us",
 *     "emails": [
 *       {
 *         "_id": "5bdcce4a-37c2-46ed-b49c-d562c6e3c4ce",
 *         "tag": "HOME",
 *         "email": "gene.lopez.at.home@example.com",
 *         "primary": true
 *       },
 *       {
 *         "_id": "78e5f398-e148-448d-b490-7c0b7d2ab336",
 *         "tag": "WORK",
 *         "email": "gene.lopez@example.com",
 *         "primary": false
 *       }
 *     ],
 *     "phones": [
 *       {
 *         "_id": "820e4640-ffe0-4980-a097-62a715e73135",
 *         "tag": "MOBILE",
 *         "countryCode": "US",
 *         "phone": "(722)-138-3099",
 *         "primary": true
 *       },
 *       {
 *         "_id": "8506549e-e4f8-42f6-b6fc-9db155b582ef",
 *         "tag": "HOME",
 *         "countryCode": "US",
 *         "phone": "(704)-454-1233",
 *         "e164Phone": "+17044541233",
 *         "primary": false
 *       }
 *     ],
 *     "addresses": [
 *       {
 *         "address": {
 *           "formatted": "9834 Bollinger Rd\nEl Cajon, WY 97766\nUS",
 *           "location": {
 *             "latitude": 84.1048,
 *             "longitude": -116.8836
 *           },
 *           "city": "El Cajon",
 *           "subdivision": "US-WY",
 *           "country": "US",
 *           "postalCode": "97766",
 *           "streetAddress": {
 *             "name": "Bollinger Rd",
 *             "number": "9834",
 *             "apt": ""
 *           }
 *         },
 *         "_id": "8532051f-91f2-42d9-9a97-9f2c39e64f7a",
 *         "tag": "HOME"
 *       }
 *     ],
 *     "profilePicture": "https://randomuser.me/api/portraits/men/0.jpg",
 *     "extendedFields": {
 *       "contacts.displayByLastName": "Lopez Gene",
 *       "emailSubscriptions.deliverabilityStatus": "NOT_SET",
 *       "emailSubscriptions.subscriptionStatus": "NOT_SET",
 *       "custom.event-we-met-at": "LegalBigData",
 *       "emailSubscriptions.effectiveEmail": "gene.lopez.at.home@example.com",
 *       "contacts.displayByFirstName": "Gene Lopez"
 *     }
 *   },
 *   "lastActivity": {
 *     "activityDate": "2021-03-30T13:12:39.649Z",
 *     "activityType": "CONTACT_CREATED"
 *   },
 *   "primaryInfo": {
 *     "email": "gene.lopez.at.home@example.com",
 *     "phone": "(722)-138-3099"
 *   },
 *   "source": {
 *     "sourceType": "OTHER"
 *   }
 * }
 */

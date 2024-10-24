import { guests } from "wix-events.v2";

/* Sample options value:
 *
 * {
 *    "fields": ["GUEST_DETAILS"]
 * }
 *
 */

export async function myQueryGuestsFunction(options) {
  try {
    const items = await guests.queryGuests(options).find();
    console.log("Success! Guests: ", items);
    return items;
  } catch (error) {
    console.error(error);
    // Handle the error
  }
}

/* Promise resolves to:
 * {
 * "_items": [
 *  {
 *     "eventId": "3a80a30c-643d-4b11-b38f-1150dbe7c538",
 *     "orderNumber": "2SVV-RH7C-P3D",
 *     "tickets": [],
 *     "contactId": "c64c558f-ed41-4395-b820-f8dd66c31702",
 *     "guestDetails": {
 *      "email": "johndoe@mail.com",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "formResponse": {
 *         "inputValues": [
 *          {
 *            "inputName": "firstName",
 *             "value": "John",
 *             "values": []
 *           },
 *           {
 *             "inputName": "lastName",
 *            "value": "Doe",
 *             "values": []
 *           },
 *           {
 *             "inputName": "email",
 *             "value": "johndoe@mail.com",
 *             "values": []
 *          }
 *         ]
 *       },
 *       "checkedIn": true
 *     }
 * ],
 * "_originQuery": {
 *   "filterTree": {
 *     "$and": []
 *   },
 *  "invalidArguments": [],
 *   "encoder": {},
 *   "transformationPaths": {},
 *   "sort": [],
 *   "paging": {},
 *   "pagingMethod": "CURSOR",
 *   "builderOptions": {
 *     "cursorWithEmptyFilterAndSort": true
 *   }
 * },
 * "_limit": 50,
 * "_nextCursor": "",
 * "_prevCursor": "",
 * "cursors": {
 *   "next": "",
 *   "prev": ""
 * }
 * }
 * }
 */

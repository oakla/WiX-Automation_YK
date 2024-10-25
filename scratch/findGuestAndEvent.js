/**
 * Autocomplete function declaration, do not delete
 * @param {import('./__schema__.js').Payload} options
 */

import { guests, wixEventsV2 } from "wix-events.v2";

async function getEvent(eventId, options) {
	try {
		const result = await wixEventsV2.getEvent(eventId, options);
		return result;
	} catch (error) {
		console.error(error);
		// Handle the error
	}
}


export const invoke = async ({payload}) => {
	const targetContactId = 'd5a743e4-7245-49ba-a21b-5358bdc4cff0'
  const options = 
  {
    "fields": [guests.RequestedFieldsEnumRequestedFields.GUEST_DETAILS]
  }
  // const items = await guests.queryGuests(options).find();
  const items = await guests.queryGuests(options).eq('contactId', targetContactId).find();

  // console.log("Success! Example Guest: ", items.items[0]);

	// const contacts = items.items.map(guest => {
	// 	return {
	// 		contactId: guest.contactId,
	// 		email: guest.guestDetails.email,
	// 		eventId: guest.eventId
	// 	}
	// })
	// console.log(contacts);

  if(items.items[0]) {
    console.log(items.items[0])
  } else {
    console.log(`items.items[0] was falsy`)
  }

	const eventLocation = await getEvent(items.items[0].location)

	if(eventLocation) {
		console.log("Success! Event: ", eventLocation);
	} else {
		console.log("eventResult was falsy")
	}
	

  return {} // The function must return an empty object, do not delete
};



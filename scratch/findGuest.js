/**
 * Autocomplete function declaration, do not delete
 * @param {import('./__schema__.js').Payload} options
 */

import { wixEvents } from "wix-events-backend";
import { guests } from "wix-events.v2";

const contactId = 'dc29fc3a-2f95-43df-aab5-bba8b2bba819'

export async function myQueryGuestsFunction(options) {
  try {
    console.log("Looking for guests ...");
    const items = await guests.queryGuests(options).find();
    // console.log("Success! Guests: ", items.items[3].contactId);

    const contactIds = items.items.map(guest => {
      return {
        contactId: guest.contactId,
        email: guest.email
      }

    }
    )
    console.log(contactIds);
    return items;
  } catch (error) {
    console.error(error);
    // Handle the error
  }
}


export const invoke = async ({payload}) => {

  // await myQueryEventsFunction()

  const options = 
  {
    "fields": ["GUEST_DETAILS"]
  }
  const guests = await myQueryGuestsFunction(options)
  // console.log(guests)

  return {} // The function must return an empty object, do not delete
};
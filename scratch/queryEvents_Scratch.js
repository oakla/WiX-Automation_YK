/**
 * Autocomplete function declaration, do not delete
 * @param {import('./__schema__.js').Payload} options
 */

import { wixEvents } from "wix-events-backend";
import { guests } from "wix-events.v2";

const contactId = 'dc29fc3a-2f95-43df-aab5-bba8b2bba819'


async function myQueryEventsFunction() {
  try {
    await wixEvents
      .queryEvents()
      .hasSome("status", ["SCHEDULED"])
      .descending("createdDate")
      .find()
      .then((results) => {
        const items = results.items;
        if (items.length === 0) {
          console.log("No events found");
          return;
        }
        else {
          const stuff = items.map(event => {
            return{
              locations: event.location,
              guestList: event.guestList
            }
          })
          console.log(stuff)
        }
      });
  } catch (error) {
    console.error(error);
    // Handle the error
  }
}


export const invoke = async ({payload}) => {

  await myQueryEventsFunction()

  return {} // The function must return an empty object, do not delete
};
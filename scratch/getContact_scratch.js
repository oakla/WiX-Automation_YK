/**
 * Autocomplete function declaration, do not delete
 * @param {import('./__schema__.js').Payload} options
 */


import { contacts } from "wix-crm-backend";

async function myGetContactFunction(contactId) {
  const options = {
    suppressAuth: false,
  };

  console.log(`Attempting getContact with ${contactId}`)
  const result = await contacts.getContact(contactId, options)
//   console.log(`result: ${JSON.stringify(result)}`)
  return result
}


export const invoke = async ({payload}) => {
  // Your code here
  // const contactId = payload.contactId

  // const contactId = "dc29fc3a-2f95-43df-aab5-bba8b2bba819"; // rik
  // const contactId = "625d1ede-3eba-453f-ab07-3fdae465c501" // melbevent
  // const contactId = "44aa15e9-3c0b-43cb-91ff-b6bb54cc5993"; // brisevent
  const contactId = "9b48e41e-8588-4b9b-9c5f-f5453f21c48b"; // jordan
  const result = await myGetContactFunction(contactId);
  console.log(result);

  return {} // The function must return an empty object, do not delete
};
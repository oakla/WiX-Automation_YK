/**
 * Autocomplete function declaration, do not delete
 * @param {import('./__schema__.js').Payload} options
 */

import { contacts } from "wix-crm-backend";

const cityGroupIdMap = {
  Sydney: "616bdbf44d",
  Melbourne: "baccf398c2",
  Brisbane: "0c2bedf9af",
  Perth: "2b70e4328d",
  Adelaide: "b1a1491d9d",
  Canberra: "bbb11b95b7",
  Newcastle: "2fe9d9cc06",
  Australia: "b1ec1eb275",
  Auckland: "3e30e99d42",
  Wellington: "3144c89b65",
  Christchurch: "8427d8c8d1",
  "New Zealand": "0f40ffd198",
  Other: "b08a7ab1b4",
};

async function myGetContactFunction(contactId) {
  const options = {
    suppressAuth: false,
  };

  console.log(`Attempting getContact with ${contactId}`);
  const result = await contacts.getContact(contactId, options);
  //   console.log(`result: ${JSON.stringify(result)}`)
  return result;
}

async function findAlternativeCityGroupInfo(contactId) {
  const contactResult = await myGetContactFunction(contactId);
  console.log(`contact_found: ${contactResult}`);

  let matchingKey = "";
  if (contactResult?.info.labelKeys) {
    const groupKeys = Object.keys(cityGroupIdMap);
    const labelKeys = contactResult.info.labelKeys;
    matchingKey = groupKeys.find((groupKey) =>
      labelKeys.some((labelKey) =>
        labelKey.toLowerCase().includes(groupKey.toLowerCase())
      )
    );
  } else {
    matchingKey = "Other";
  }
  console.log(`matchingKey: ${matchingKey}`);
  return matchingKey;
}

export const invoke = async ({ payload }) => {
  // Your code here
  // const contactId = payload.contact.contactId

  const contactId = "dc29fc3a-2f95-43df-aab5-bba8b2bba819"; // rik
  // const contactId = "625d1ede-3eba-453f-ab07-3fdae465c501" // melbevent
  const result = await findAlternativeCityGroupInfo(contactId);
  console.log(result);

  return {}; // The function must return an empty object, do not delete
};

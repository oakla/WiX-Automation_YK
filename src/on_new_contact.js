/**
 * Autocomplete function declaration, do not delete
 * @param {import('./__schema__.js').Payload} options
 */

/** Author notes
 * This code is intended to be placed in a 'Run Velo code' action of a WIX automation
 * 
 * The trigger for the automation is 'New contact created'
 * 
 * Payload should contain data of the new contact
 */


import {fetch} from 'wix-fetch'; 
import { getSecret } from "wix-secrets-backend";
import { contacts } from "wix-crm-backend";
import { guests, wixEventsV2 } from "wix-events.v2";


async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
    try {
        const response = await fetch(url, options);
        
        // Retry only for errors that are likely temporary or intermittent
        if ([500, 502, 503, 504].includes(response.status)) {
            if (retries > 0) {
                console.warn(`Request failed with status ${response.status}. Retrying in ${backoff}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                return fetchWithRetry(url, options, retries - 1, backoff * 2);  // Exponential backoff
            } else { // no more retries
                throw new Error(`Failed after ${3 - retries} retries. response: ${JSON.stringify(response)}`);
            }
        }

        return response;  // If successful or the error is not likely intermittent
    } catch (error) {
        if (retries > 0) {
            console.warn(`Request failed: ${error.message}. Retrying in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);  // Exponential backoff
        } else {
            throw new Error(`No more retries: ${error.message}`);
        }
    }
}

const cityGroupIdMap = {
    "Sydney": "616bdbf44d",
    "Melbourne": "baccf398c2",
    "Brisbane": "0c2bedf9af",
    "QLD": "0c2bedf9af", // Maps to Brisbane - considered equivalent
    "Perth": "2b70e4328d",
    "Adelaide": "b1a1491d9d",
    "Canberra": "bbb11b95b7",
    "Newcastle": "2fe9d9cc06",
    "Australia": "b1ec1eb275",
    "Auckland": "3e30e99d42",
    "Wellington": "3144c89b65",
    "Christchurch": "8427d8c8d1",
    "New Zealand": "0f40ffd198",
    "Other": "b08a7ab1b4"
}


async function myGetContactFunction(contactId) {
  console.log("Running myGetContactFunction(...)")
  const options = {
    suppressAuth: true,
  };

  console.log(`Attempting getContact with contactId = ${contactId}, options = ${JSON.stringify(options)}`);
  const result = await contacts.getContact(contactId, options);
  console.log(`contact_found: ${JSON.stringify(result)}`);
  return result;
}


async function getEvent(eventId, options) {
	try {
		const result = await wixEventsV2.getEvent(eventId, options);
		return result;
	} catch (error) {
		console.error(error);
		// Handle the error
	}
}

export async function myQueryGuestsFunction(targetContactId) {

  console.log(`Looking for guests with contactId = ${targetContactId} ...`);
  const options = {
    "fields": [guests.RequestedFieldsEnumRequestedFields.GUEST_DETAILS]
  }

  try {
    const items = await guests.queryGuests(options).eq('contactId', targetContactId).find();
    if(items.items[0]) {
      console.log(`Guest found: ${JSON.stringify(items.items[0])}`)
      return items.items[0]
    } else {
      console.log(`items.items[0] was falsy`)
      return null
    }
  } catch (error) {
    console.error(error);
    // Handle the error
  }
}

async function findAttendingEvent(contactId) {
  console.log("Running findAttendingEvent(...)")
  const guest = myQueryGuestsFunction(contactId)
  if(guest){
    const eventResult = await getEvent(guest.eventId)
    if(eventResult) {
      console.log(`Event found: ${JSON.stringify(eventResult)}`)
      return eventResult
    } else {
      console.log("eventResult was falsy")
    }
  } else {
    console.log("guest was falsy")
  }
  
}

function findCityKeyMatch(stringsToSearch) {
  const groupKeys = Object.keys(cityGroupIdMap);
  groupKeys = groupKeys.filter(x => x.toLowerCase() !== "other")
  return groupKeys.find((groupKey) =>
    stringsToSearch.some((string) =>
      string.toLowerCase().includes(groupKey.toLowerCase())
    )
  );
}


async function findAlternativeCityGroupInfo(contactId) {
  console.log("Running findAlternativeCityGroupInfo(...)")
  const contactResult = await myGetContactFunction(contactId);

  let matchingKey = "";
  if (contactResult?.info.labelKeys) {
    const labelKeys = contactResult.info.labelKeys;
    matchingKey = findCityKeyMatch(labelKeys);
  } 
  if (!matchingKey) {
    eventResult = findAttendingEvent(contactId);
    matchingKey = findCityKeyMatch(
      [
        eventResult?.title,
        eventResult?.contactLabel,
        eventResult.location?.address?.city, 
        eventResult.location?.address?.addressLine,
        eventResult?.slug,
        eventResult.location?.address?.subdivision
      ]
    );
  }
  if (!matchingKey) {
    console.log("No matching key found in contact or event data. Defaulting to 'Other'.");
    matchingKey = "Other";
  }

  console.log(`matchingKey: ${matchingKey}`);
  return matchingKey;
}

async function addSubscriber(email, firstName, lastName, cityGroup) {

    console.log(`Attempting to add subscriber to Mailchimp; email:${email}, first name:${firstName}, last name:${lastName}, city group:${cityGroup}`)

    const API_KEY = await getSecret("Mailchimp-API-key");
    const AUDIENCE_ID = '2e002b7472'; 
    const DATA_CENTER = 'us14'; 

    const url = `https://${DATA_CENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/`;

    const subscriberData = {
        "email_address": email,
        "status": "subscribed",
        "email_type": "html",
        "merge_fields": {
            "FNAME": firstName,
            "LNAME": lastName
        },
        "interests":{}
    };

    if(cityGroupIdMap[cityGroup]){
        subscriberData.interests[cityGroupIdMap[cityGroup]] = true;
    }
    
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriberData)
    };

    // fetchWithRetry(url, options)
    //     .then(response => response.json())
    //     .then(data => console.log(data))
    //     .catch(error => console.error(error.message));

    try {
        const response = await fetchWithRetry(url, options);
        const result = await response.json();

        if (response.ok) {
            return {
                success: true,
                message: "Subscriber added successfully!",
                errorDetail: ""
            };
        } else {
            return {
                success: false,
                message: `Error adding subscriber: ${result.detail}`,
                errorDetail: JSON.stringify(result.errors)
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Error message: ${error.message}`,
            errorDetail: JSON.stringify(error)
        };
    }
}

export const invoke = async ({payload}) => {
    // Your code here
    console.log("Running code action in response to 'new contact created trigger'")
    console.log(`payload == ${JSON.stringify(payload)}`)

    let cityGroup = ""
    if(payload.contact.address?.addressLine){
        cityGroup = payload.contact.address.addressLine
    } else {
        console.log("No addressLine found in payload.")
        cityGroup = await findAlternativeCityGroupInfo(payload.contactId)
    }
    
    const outcome = await addSubscriber(
        payload.contact.email,
        payload.contact.name.first,
        payload.contact.name.last,
        cityGroup
    )
    if(outcome.success) {
        console.log(JSON.stringify(outcome));
    } else {
        console.error(JSON.stringify(outcome));
    }
        
    return {} // The function must return an empty object, do not delete
};
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


async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
    try {
        const response = await fetch(url, options);
        
        // Retry only for specific status codes
        if ([500, 502, 503, 504].includes(response.status)) {
            if (retries > 0) {
                console.warn(`Request failed with status ${response.status}. Retrying in ${backoff}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                return fetchWithRetry(url, options, retries - 1, backoff * 2);  // Exponential backoff
            } else { // no more retries
                throw new Error(`Failed after ${3 - retries} retries. response: ${JSON.stringify(response)}`);
            }
        }

        return response;  // Return the response if successful or the error is not likely intermittent
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
  const options = {
    suppressAuth: true,
  };

  console.log(`Attempting getContact with ${contactId}`);
  const result = await contacts.getContact(contactId, options);
  console.log(`contact_found: ${JSON.stringify(result)}`);
  return result;
}


async function findAlternativeCityGroupInfo(contactId) {
  const contactResult = await myGetContactFunction(contactId);

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
    console.log(payload)

    let cityGroup = ""
    if(payload.contact.address?.addressLine){
        cityGroup = payload.contact.address.addressLine
    } else {
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
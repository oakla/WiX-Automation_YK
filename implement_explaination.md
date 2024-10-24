## Notes on Implementation

1. When someone sign's up for the newsletter or RSVP's for an event, their email is added to the database in WIX as a new contact.
2. This triggers the WIX automation to POST the new contact to Mailchimp via their API.


### Weirdness
- In Mailchimp, contacts can be added to 'groups'. In the API, these groups are referred to as 'interests'.
- The API requires the group ID to add a contact to a group. This ID is not easily accessible from the Mailchimp dashboard. 
  - the [city groups](city_groups) document contains the group ID's for the cities that are currently in usec


## Previous Implementation notes
Originally the plan was to write code that would be triggered on form submission. 
 
Instead, the code will be triggered on the creation of a new contact. This is achieved through the native WIX automation tools.
 
## Short Comings / Potential for future work
Automatically updating the ‘location’ field in Mailchimp is non-trivial in the current implementation. 
### Suggested Solution
The suggestion is to convert the location field in the submission form to be a drop down so that predefined values can easily captured and then sent to Mailchimp (rather than mapping free text inputs to categories)




## Get event location for given contactId

```js
import { guests } from "wix-events.v2";

// https://dev.wix.com/docs/velo/api-reference/wix-events-v2/guests/introduction
const items = await guests.queryGuests(options).find();
console.log("Success! Example Guest: ", items.items[0].contactId);

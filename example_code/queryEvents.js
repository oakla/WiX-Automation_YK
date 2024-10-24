import { Permissions, webMethod } from "wix-web-module";
import { wixEvents } from "wix-events-backend";

export const myQueryEventsFunction = webMethod(Permissions.Anyone, async () => {
  try {
    await wixEvents
      .queryEvents()
      .hasSome("status", ["SCHEDULED"])
      .descending("createdDate")
      .find()
      .then((results) => {
        const items = results.items;
        const firstItem = items[0];
        console.log("Success! Events:", firstItem);
        return firstItem;
      });
  } catch (error) {
    console.error(error);
    // Handle the error
  }
});

/* Promise resolves to: 
 {
  "about": "Join us for Nature's Symphony: A Musical Journey Through Wildlife at the iconic Royal Albert Hall.",
  "assignedContactsLabel": "custom.natures-symphony-a-musical-journey-through-wildl",
  "calendarLinks": {
    "google": "http://calendar.google.com/calendar/render?action=TEMPLATE&text=Nature%27s+Symphony%3A+A+Musical+Journey+Through+Wildlife.&dates=&location=Kensington+Gore%2C+London+SW7%2C+UK&details=Thank+you+for+registering+to+our+event%21+Your+tickets+are+attached+to+this+email.+Don%27t+forget+to+bring+them.%0A%0AWe%27re+looking+forward+to+seeing+you+there.%0A%0AHere+are+the+details%3A%0A%0ANature%27s+Symphony%3A+A+Musical+Journey+Through+Wildlife.%0AThe+date+will+be+announced+soon%2C+stay+tuned%21%0ARoyal+Albert+Hall%2C+Kensington+Gore%2C+London+SW7%2C+UK",
    "ics": "https://www.wixevents.com/media/v2/calendar?token=JWS.eyJraWQiOiJpb21iOUJ0eSIsImFsZyI6IkhTMjU2In0.eyJkYXRhIjoie1wiaW5zdGFuY2VJZFwiOlwiMWY2ZGM5MDYtODAzZC00NjUwLTgzZjUtNzJlYTFkODgxMDBiXCIsXCJldmVudElkXCI6e1widmFsdWVcIjpcImQxNTJmNDJjLTcyMWMtNDc3MC1hMTc4LWYwZTZjMWQ1NWYyN1wifSxcIm9jTGlua1wiOm51bGx9IiwiaWF0IjoxNjk5NTMxNjUzfQ.tiiCPGnU-ZD9ZKRoJe6vqcyi0HeHDCju6GKphZEDtN0"
  },
  "categories": [],
  "createdBy": "",
  "_createdDate": "2023-11-08T15:06:13.353Z",
  "description": "Immerse yourself in the enchanting harmony of nature's symphony as it intertwines with the power of music!",
  "eventUrl": {
    "baseUrl": "https://mysite.com/events",
    "path": "/event-details-registration/natures-symphony-a-musical-journey-through-wildlife"
  },
  "form": {
    "inputGroups": [
      {
        "_id": "name",
        "inputs": [
          {
            "additionalLabels": [],
            "label": "First name",
            "maxLength": 50,
            "name": "firstName",
            "options": [],
            "required": true,
            "type": "TEXT"
          },
          {
            "additionalLabels": [],
            "label": "Last name",
            "maxLength": 50,
            "name": "lastName",
            "options": [],
            "required": true,
            "type": "TEXT"
          }
        ],
        "orderIndex": 0,
        "system": true,
        "type": "NAME"
      },
      {
        "_id": "email",
        "inputs": [
          {
            "additionalLabels": [],
            "label": "Email",
            "maxLength": 255,
            "name": "email",
            "options": [],
            "required": true,
            "type": "TEXT"
          }
        ],
        "orderIndex": 1,
        "system": true,
        "type": "INPUT"
      }
    ],
    "messages": {
      "checkout": {
        "checkoutLabel": "Continue",
        "title": "Add your details"
      },
      "registrationClosed": {
        "exploreEventsLabel": "See other events",
        "message": "Registration is closed"
      },
      "rsvp": {
        "noMessages": {
          "confirmationTitle": "Sorry You Can't Make It",
          "shareLabel": "Share",
          "title": "Add your details"
        },
        "rsvpNo": "Not Going",
        "rsvpYes": "I'm Going",
        "submitRsvpLabel": "SUBMIT",
        "waitingMessages": {
          "addToCalendarLabel": "Add to Calendar",
          "confirmationMessage": "We'll update you if additional spots become available.",
          "confirmationTitle": "Thanks! You've been added to the waitlist.",
          "shareLabel": "Share",
          "title": "Looks like this event is full. Join the waitlist."
        },
        "yesMessages": {
          "addToCalendarLabel": "Add to Calendar",
          "confirmationMessage": "An email with all the event info was sent to you.",
          "confirmationTitle": "Thank you!",
          "shareLabel": "Share",
          "title": "Add your details"
        }
      }
    }
  },
  "guestList": {
    "public": true
  },
  "_id": "d152f42c-721c-4770-a178-f0e6c1d55f27",
  "language": "en",
  "location": {
    "address": {
      "formatted": "Kensington Gore, London SW7, UK",
      "location": {
        "latitude": 51.5009132,
        "longitude": -0.1766086
      },
      "city": "London",
      "country": "GB",
      "postalCode": "SW7 2BL",
      "streetAddress": {
        "name": "Kensington Gore",
        "number": "SW7",
        "apt": ""
      }
    },
    "name": "Royal Albert Hall",
    "tbd": false,
    "type": "VENUE"
  },
  "registration": {
    "initialType": "TICKETS",
    "restrictedTo": "VISITOR",
    "rsvp": {
      "responseOptions": "YES_ONLY",
      "waitlist": false
    },
    "status": "CLOSED",
    "tickets": {
      "formAssignedPerTicket": false,
      "highestTicketPrice": {},
      "lowestTicketPrice": {},
      "tax": {}
    },
    "type": "TICKETS"
  },
  "scheduling": {
    "formatted": "The date will be announced soon, stay tuned!",
    "hideEndDate": false,
    "showTimeZone": false,
    "startDateFormatted": "",
    "startTimeFormatted": "",
    "tbd": true,
    "tbdMessage": "The date will be announced soon, stay tuned!"
  },
  "slug": "natures-symphony-a-musical-journey-through-wildlife",
  "status": "SCHEDULED",
  "summary": {
    "rsvp": {},
    "tickets": {
      "revenue": {},
      "totalSales": {}
    }
  },
  "title": "Nature's Symphony: A Musical Journey Through Wildlife.",
  "_updatedDate": "2023-11-08T15:06:13.000Z",
  "videoConferencing": {
    "session": {}
  }
}
*/

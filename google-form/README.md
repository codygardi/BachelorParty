# Robbie's Bachelor Party Google Form

This folder contains a Google Apps Script that creates a Google Form for the bachelor party invitation.

For the version where invitees are tied to saved phone numbers, guests use one shared link, and the RSVP locks after the first response, use the files in `web-app` instead of the simple Google Form generator.

## Cost

The simple Google Form and the web-app version are both designed to run with no-cost Google account tools. They do not send SMS messages or use paid APIs.

## How to create the form

1. Go to https://script.google.com/.
2. Create a new project.
3. Replace the starter code with the contents of `create_bachelor_party_form.gs`.
4. Click **Run** and approve the Google permissions.
5. Open **Executions** or **Logs** to copy:
   - The edit link for the form.
   - The published RSVP link to send guests.

## Included questions

- Your name, selected from a dropdown invitee list.
- RSVP.
- Weekend availability, with multiple selections allowed:
  - Weekend of Jan 9: Friday afternoon Jan 8 + Saturday Jan 9.
  - Weekend of Jan 16: Friday afternoon Jan 15 + Saturday Jan 16.
  - Weekend of Jan 23: Friday afternoon Jan 22 + Saturday Jan 23.
  - None of these weekends work for me.
- Location: Grass Valley, CA.
- What to bring: will be updated after finalizing a weekend.
- Activities: will be updated after finalizing a weekend.
- Est. Cost: will be updated after finalizing a weekend.
- Optional phone number.
- Optional notes for planning.

Note: In 2027, Jan 9, 16, and 23 are Saturdays. The options use the matching Friday afternoons on Jan 8, 15, and 22.

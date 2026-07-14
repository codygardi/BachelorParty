# Robbie's Bachelor Party RSVP Web App

Use this version when you want each invitee tied to a phone number and want the RSVP section to lock after their first submission.

Google Forms cannot detect a guest's phone number, and it cannot make only one section read-only for one guest after they submit. This Apps Script web app handles that workflow with a tracker spreadsheet.

## Setup From Scratch

1. Go to https://script.google.com/.
2. Create a new project.
3. Rename the project to `Robbie's Bachelor Party RSVP`.
4. In the starter `Code.gs` file, replace the starter code with this folder's `Code.gs`.
5. Add an HTML file named `Index`.
6. Replace the starter HTML with this folder's `Index.html`.
7. In the function dropdown, select `setupBachelorPartyWebApp`.
8. Click `Run`.
9. Approve the permissions for your own Google account.
10. Open the logged tracker spreadsheet URL.
11. In the `Invitees` tab, add each person's phone number next to their name.
12. Optional: update the `Updates` tab with any current trip details.
13. Deploy the project as a web app:
   - Execute as: `Me`
   - Who has access: `Anyone with the link`
14. Copy the deployed web app URL.
15. Send that same shared web app URL to everyone.

## Link Troubleshooting

Use the deployed web app URL, not the Google Drive file URL and not the Apps Script editor URL. The correct link should look like this:

`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`

If your browser opens a link like this, it will not work:

`https://script.google.com/macros/u/1/s/YOUR_DEPLOYMENT_ID/exec`

Delete the `/u/1` part so the link becomes:

`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`

If you see a Google Drive page that says it cannot open the file, you probably copied the Apps Script project file link from Drive instead of the web app URL.

To copy the correct URL:

1. Open the Apps Script project.
2. Click `Deploy` in the top right.
3. Click `Manage deployments`.
4. Click the active web app deployment.
5. Copy the `Web app URL`.
6. Make sure the URL ends in `/exec`.

If the link opens for you but not for guests, edit the deployment and set `Who has access` to `Anyone with the link`, then deploy a new version.

## Cost

This setup is designed to use only no-cost Google account tools: Apps Script, Sheets, and Drive storage. It does not send SMS messages or use paid APIs. The only practical limits should be normal Google account storage and Apps Script quotas, which this small invite list should stay far below.

## Privacy Note

The shared-link version does not ask guests to verify their phone number. Anyone with the shared link can select any name in the dropdown and see the phone number saved for that invitee. Use unique invite links instead if you want stronger separation between guests.

## Current Invitees

- Max Voorhees: 5302103099
- Thomas Correll: 5302637719
- Jonno Christie: 8053414024
- Lane Carleson: 5309136251
- Sean Fitzhenry: 5305598103
- Andrew Kostolefsky: 5305595048
- Cody Gardi: 9253938441

## How It Works

- Each invitee has a name and phone number in the `Invitees` tab. The current invitee list is seeded from `Code.gs`.
- A guest opens the shared web app link, selects their name, and sees their saved phone number on the RSVP screen.
- Once a guest submits their RSVP, the response is saved in the `Responses` tab.
- If they reopen the link, the RSVP section is shown as read-only.
- The `Updates` tab controls the visible trip details:
  - Location
  - Flights
  - What to bring
  - Activities
  - Est. Cost

The `Updates` tab also supports optional links with the `Link Label` and `Link URL` columns. The default setup includes a Google Maps link for Grass Valley, CA and a Google Flights link.

Update the `Updates` tab whenever plans change. Guests will see those updates when they reopen their invite link.

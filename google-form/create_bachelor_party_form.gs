function createBachelorPartyInvitationForm() {
  const title = "Robbie's Bachelor Party RSVP - January 2027";
  const weekendOptions = [
    'Weekend of Jan 9: Friday afternoon Jan 8 + Saturday Jan 9',
    'Weekend of Jan 16: Friday afternoon Jan 15 + Saturday Jan 16',
    'Weekend of Jan 23: Friday afternoon Jan 22 + Saturday Jan 23',
    'None of these weekends work for me'
  ];
  const invitees = [
    'Max Voorhees',
    'Thomas Correll',
    'Jonno Christie',
    'Lane Carleson',
    'Sean Fitzhenry',
    'Andrew Kostolefsky',
    'Cody Gardi'
  ];

  const form = FormApp.create(title)
    .setDescription(
      'Location: Grass Valley, CA\n\nPlease RSVP and select every January 2027 weekend that could work for you. Each option is Friday afternoon plus Saturday.'
    )
    .setConfirmationMessage('Thanks! Your RSVP has been recorded.')
    .setAllowResponseEdits(true)
    .setAcceptingResponses(true);

  form.addListItem()
    .setTitle('Your name')
    .setChoiceValues(invitees)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('RSVP')
    .setChoiceValues([
      'Yes, I am in',
      'Maybe / depends on the date',
      'Sorry, I cannot make it'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Which weekend(s) work for you?')
    .setHelpText('Select all that apply.')
    .setChoiceValues(weekendOptions)
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('Location')
    .setHelpText('Grass Valley, CA');

  form.addSectionHeaderItem()
    .setTitle('What to bring')
    .setHelpText('Will be updated after finalizing a weekend.');

  form.addSectionHeaderItem()
    .setTitle('Activities')
    .setHelpText('Will be updated after finalizing a weekend.');

  form.addSectionHeaderItem()
    .setTitle('Est. Cost')
    .setHelpText('Will be updated after finalizing a weekend.');

  form.addTextItem()
    .setTitle('Phone number')
    .setHelpText('Optional, for coordination.');

  form.addParagraphTextItem()
    .setTitle('Anything else the planner should know?')
    .setHelpText('Travel constraints, timing notes, dietary restrictions, or other details.');

  Logger.log('Edit the form: ' + form.getEditUrl());
  Logger.log('Send this RSVP link: ' + form.getPublishedUrl());
}

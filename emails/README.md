# StudySync Identity email templates

These responsive, inline-styled HTML fragments match the StudySync app and keep Netlify's required action links intact. Netlify custom Identity email templates require a Pro plan or higher.

In Netlify, open **Identity → Emails** and set the template paths:

| Identity email | Template path | Suggested subject |
|---|---|---|
| Confirmation | `/emails/confirmation.html` | Confirm your StudySync account |
| Password recovery | `/emails/recovery.html` | Reset your StudySync password |
| Invitation | `/emails/invitation.html` | You’re invited to StudySync |
| Email change | `/emails/email-change.html` | Confirm your new StudySync email |

The templates are published with the site. Netlify lets you set each subject in the same Identity email settings page.

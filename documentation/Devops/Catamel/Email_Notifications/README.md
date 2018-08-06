## Email Notifications

When jobs have been submitted successfully, the `node-mailer` package can send an email to the user that initiated.

In future, this functionality can be extended to report on job progress.

### Config

The user details are loaded into `server/config.local.js` and the following block provides an example:

```
smtpSettings: {
      host: 'HOSTPATH',
      port: 587,
      secure: false,
      auth: {user: DOMAIN\\USER', pass: 'PWD'}
    },
    smtpMessage: {
      from: 'gac-dacats@psi.ch',
      to: undefined,
      subject: '[SciCat]',
      text: undefined // can also set html key and this will override this
    }
```
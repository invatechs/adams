# Adams
Use GitHub and BitBucket webhook to deploy and notify with slack or email (sender-js).

1. Start it on your server;
2. Edit `config.json` file.


For configuring webhooks edit `config.json`

## Projects:

- `"git": "https://github.com/invatechs/adams.git"` - link used for clone project;
- `"gitBranch": "master"` - single branch you want to be proceeded; 
- `"username": "username"` - username for git account that have at least read rights for git repository;
- `"password": "password"` - password for that git account;
- `"webhookPath": "your-hook"` - path for webhook after server DNS address, for example: you have your server running on `http://ec2-11-22-333-444.us-west-1.compute.amazonaws.com`, so you can create webhook `http://ec2-11-22-333-444.us-west-1.compute.amazonaws.com/your-hook`;      


## Notifications:

We use [sender-js](https://www.npmjs.com/package/sender-js) for sending notifications by e-mail, Slack or HTTP API.

Configure `"notification"` field in `config.js` according to [sender-js](https://www.npmjs.com/package/sender-js) like so:

`
"notifications": {
    "senderJs": {
      "slack": {
        "token": "xoxb-12312312312-dfsfd7t2JfdfJfdslfsdjap2",
        "channel": "general"
      },
      "mailgun": {
        "apiKey": "key-123213123123123123kjn2312n3123kn",
        "domain": "mg.your-domain.com"
      }
    },
    "mailReciever": "email-address1@mail.com,email-address2@mail.com",
    "mailSender": "dummy-email-address@mail.com"
  }
`
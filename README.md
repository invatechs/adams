# Adams
ADAMS stands for "automated deploy and monitoring system". 
It uses GitHub and BitBucket webhooks to clone ([nodegit](https://www.npmjs.com/package/nodegit)), deploy and notify ([sender-js](https://www.npmjs.com/package/sender-js)).

1. Start it on your server.
2. Edit `config.json` file.


For configuring `adams` edit `config.json`.

## Installation
ADAMS has been fully tested in POSIX systems. There are to ways to install and use ADAMS:
### 1. Install ADAMS globally
Install ADAMS as separate application using the following command:
```
npm install -g adams
```

### 2. Install as usual Node.js application
Clone ADAMS onto your system and run it as common Node.js application.

## Usage
ADAMS can be used in several ways. If you have installed it globally with `-g` option, ADAMS will be avaible systemwide with `adams` command. To stop service use `stop` keyword:
```
adams stop
```

Here is the full list of CLI options for ADAMS:
```
Usage: adams [options]

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -p, --projects [projectsFile]  Path to projects file
    stop                           Stop the application
    -l, --log [logFile]            Path to log file
```

If you have not installed ADAMS globally you can use `npm link` command to make ADAMS CLI works properly.

Also you can run ADAMS simply with command
```
node adams
```
which is call in ADAMS directory

And there are two SH files to start and stop ADAMS service
```
./start.sh
./stop.sh
```
Make sure that both files have executable right or run them with `sh` command.


## Projects configuration

All the fields are required. Remember to use pure JSON format. Each project could be overwritten like so:

```js
"projects": [
    {
        "git": "https://github.com/invatechs/adams.git", // link used for clone project;
        "gitBranch": "master", // single branch you want to be proceeded;
        "username": "username", // username for git account that have at least read rights for git repository; you can specify empty username and password if current git account is publick; 
        "password": "password", // password for that git account;
        "webhookPath": "your-hook-path" // path for webhook after server DNS address, for example: you have your server running on `http://ec2-11-22-333-444.us-west-1.compute.amazonaws.com`, so you can create webhook `http://ec2-11-22-333-444.us-west-1.compute.amazonaws.com/your-hook-path`;
    }
]
```

## Notifications

We use sender-js for sending notifications by e-mail, Slack or HTTP API.

Configure `"notification"` field in `config.json` according to [sender-js](https://www.npmjs.com/package/sender-js) like so:

```js
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
    "mailReceiver": "email-address1@mail.com,email-address2@mail.com",
    "mailSender": "dummy-email-address@mail.com"
  }
```


## <a name="configuring-nginx"></a>Configuring Nginx

You should update Nxing's `.conf` file adding routes according to your webhooks paths. It can look like so:
                                                                          
```js
server {
    server_name ec2-11-22-333-444.us-east-1.compute.amazonaws.com;
    listen 80;
    root /var/www/aws.url;
        
    location / {
        proxy_pass http://127.0.0.1:7895/; # 7895 - port which adams listens
    }
}
```
 

## Monitoring

Adams provides simple web interface for monitoring your `.log` files.

Configuring monitoring requires you to follow steps below:

1) Configure `config.json` - add/update `"monitoring"` field like so:
```js
"monitoring": {
    "path": "adams-log", // path for all projects page
    "projects": [
        {
            "logPath": "/var/www/app1/app.log", // absolute path to the .log file
            "alias": "my-app-1" // name that would be shown at the all projects page
        },
        {
            "logPath": "/var/www/app2/app.log",
            "alias": "my-app-2"
        }
    ]
}
```

2) Make sure that route `/adams-log` is available through you Nginx `.conf`. Look at [Configuring Nginx](#configuring-nginx).


## Tests
 
There are few tests for [Mocha](http://mochajs.org). 
You can start tests running `npm test` command from parent directory. 
We keep working on covering Adams with this kind of tests.

Also you can simply run `node test.js` from `./test` directory - that test starts Adams 
with `./config.json` configuration and logs output to `./lib/app.log` file. 
Then it sends simple template POST request to Adams and Adams starts cloning and 
deploying himself locally from [Adams GitHub public repository](https://github.com/invatechs/adams).
That test also include monitoring itself - configure `"monitoring.projects[0].logPath"` field 
according to your directory. 


## License
Copyright 2015 Invatechs.

Licensed under the MIT License.

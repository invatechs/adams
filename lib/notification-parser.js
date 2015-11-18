/**
 * Check BitBucket hook object and parse body
 * @function parseBitBucket
 * @param {object} requestBody
 * @param {object} project - project object from config.json
 */
var bitbucketTest = {
  push: {
    changes: [{"new":{name: 'master', target: {message: 'testing'}}}]
  },
  repository: {
    name: 'cc-web',
    full_name: 'invatechs/cc-web',
    is_private: true,
    uuid: '{06963f45-c8a7-4565-b063-c9878abd15eb}',
    links: {},
    owner: {},
    scm: 'git',
    type: 'repository'
  },
  actor: {
    display_name: 'Dmitry Rusakov',
    username: 'dmitryrusakov',
    links: {},
    type: 'user',
    uuid: '{0a9806bf-1281-47b2-bf90-6f5b27d09a26}'
  }
};
var parseBitBucket = function(requestBody, project) {
  requestBody = bitbucketTest;
  if(!!requestBody.repository) {
    if(project.webhookPath.match([requestBody.repository.full_name])) {
      if(project.gitBranch === requestBody.push.changes[0].new.name) {
        var notificationData = {};
        notificationData.branch = requestBody.push.changes[0].new.name;
        notificationData.pusher = requestBody.actor.username;
        notificationData.commitComment = requestBody.push.changes[0].new.target.message;
        return notificationData;
      } else {
        console.log('@parseBitBucket: wrong branch name');
      }
    } else {
      console.log('@parseBitBucket: wrong repository name');
    }
  } else {
    console.log('@parseBitBucket: wrong data format');
  }
  return {};
};


/**
 * Check GitHub hook object and parse body
 * @function parseGitHub
 * @param {object} requestBody
 * @param {object} project - project object from config.json
 */
var githubTest = {
  "ref": "refs/heads/master",
  "before": "ad75de6b43af54ef62b60f629296bdcc87e30236",
  "after": "5e854cba37f78edf08803d7fef0c2857dcc7e78e",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/cccollect/api-worker/compare/ad75de6b43af...5e854cba37f7",
  "commits": [
    {
      "id": "5e854cba37f78edf08803d7fef0c2857dcc7e78e",
      "distinct": true,
      "message": "paypal status code behaviour fix",
      "timestamp": "2015-11-02T15:56:12+03:00",
      "url": "https://github.com/cccollect/api-worker/commit/5e854cba37f78edf08803d7fef0c2857dcc7e78e",
      "author": {
        "name": "Ivan Vetrov",
        "email": "i.vetrov@gmail.com",
        "username": "i-vetrov"
      },
      "committer": {
        "name": "Ivan Vetrov",
        "email": "i.vetrov@gmail.com",
        "username": "i-vetrov"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "paypal-endpoint.js"
      ]
    }
  ],
  "head_commit": {
    "id": "5e854cba37f78edf08803d7fef0c2857dcc7e78e",
    "distinct": true,
    "message": "paypal status code behaviour fix",
    "timestamp": "2015-11-02T15:56:12+03:00",
    "url": "https://github.com/cccollect/api-worker/commit/5e854cba37f78edf08803d7fef0c2857dcc7e78e",
    "author": {
      "name": "Ivan Vetrov",
      "email": "i.vetrov@gmail.com",
      "username": "i-vetrov"
    },
    "committer": {
      "name": "Ivan Vetrov",
      "email": "i.vetrov@gmail.com",
      "username": "i-vetrov"
    },
    "added": [

    ],
    "removed": [

    ],
    "modified": [
      "paypal-endpoint.js"
    ]
  },
  "repository": {
    "id": 33254940,
    "name": "api-worker",
    "full_name": "cccollect/api-worker",
    "owner": {
      "name": "cccollect",
      "email": ""
    },
    "private": true,
    "html_url": "https://github.com/cccollect/api-worker",
    "description": "Server api worker",
    "fork": false,
    "url": "https://github.com/cccollect/api-worker",
    "forks_url": "https://api.github.com/repos/cccollect/api-worker/forks",
    "keys_url": "https://api.github.com/repos/cccollect/api-worker/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/cccollect/api-worker/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/cccollect/api-worker/teams",
    "hooks_url": "https://api.github.com/repos/cccollect/api-worker/hooks",
    "issue_events_url": "https://api.github.com/repos/cccollect/api-worker/issues/events{/number}",
    "events_url": "https://api.github.com/repos/cccollect/api-worker/events",
    "assignees_url": "https://api.github.com/repos/cccollect/api-worker/assignees{/user}",
    "branches_url": "https://api.github.com/repos/cccollect/api-worker/branches{/branch}",
    "tags_url": "https://api.github.com/repos/cccollect/api-worker/tags",
    "blobs_url": "https://api.github.com/repos/cccollect/api-worker/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/cccollect/api-worker/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/cccollect/api-worker/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/cccollect/api-worker/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/cccollect/api-worker/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/cccollect/api-worker/languages",
    "stargazers_url": "https://api.github.com/repos/cccollect/api-worker/stargazers",
    "contributors_url": "https://api.github.com/repos/cccollect/api-worker/contributors",
    "subscribers_url": "https://api.github.com/repos/cccollect/api-worker/subscribers",
    "subscription_url": "https://api.github.com/repos/cccollect/api-worker/subscription",
    "commits_url": "https://api.github.com/repos/cccollect/api-worker/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/cccollect/api-worker/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/cccollect/api-worker/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/cccollect/api-worker/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/cccollect/api-worker/contents/{+path}",
    "compare_url": "https://api.github.com/repos/cccollect/api-worker/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/cccollect/api-worker/merges",
    "archive_url": "https://api.github.com/repos/cccollect/api-worker/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/cccollect/api-worker/downloads",
    "issues_url": "https://api.github.com/repos/cccollect/api-worker/issues{/number}",
    "pulls_url": "https://api.github.com/repos/cccollect/api-worker/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/cccollect/api-worker/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/cccollect/api-worker/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/cccollect/api-worker/labels{/name}",
    "releases_url": "https://api.github.com/repos/cccollect/api-worker/releases{/id}",
    "created_at": 1427901335,
    "updated_at": "2015-10-19T19:05:06Z",
    "pushed_at": 1446468995,
    "git_url": "git://github.com/cccollect/api-worker.git",
    "ssh_url": "git@github.com:cccollect/api-worker.git",
    "clone_url": "https://github.com/cccollect/api-worker.git",
    "svn_url": "https://github.com/cccollect/api-worker",
    "homepage": null,
    "size": 1168,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "JavaScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "stargazers": 0,
    "master_branch": "master",
    "organization": "cccollect"
  },
  "pusher": {
    "name": "i-vetrov",
    "email": "i.vetrov@gmail.com"
  },
  "organization": {
    "login": "cccollect",
    "id": 11723256,
    "url": "https://api.github.com/orgs/cccollect",
    "repos_url": "https://api.github.com/orgs/cccollect/repos",
    "events_url": "https://api.github.com/orgs/cccollect/events",
    "members_url": "https://api.github.com/orgs/cccollect/members{/member}",
    "public_members_url": "https://api.github.com/orgs/cccollect/public_members{/member}",
    "avatar_url": "https://avatars.githubusercontent.com/u/11723256?v=3",
    "description": ""
  },
  "sender": {
    "login": "i-vetrov",
    "id": 3099131,
    "avatar_url": "https://avatars.githubusercontent.com/u/3099131?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/i-vetrov",
    "html_url": "https://github.com/i-vetrov",
    "followers_url": "https://api.github.com/users/i-vetrov/followers",
    "following_url": "https://api.github.com/users/i-vetrov/following{/other_user}",
    "gists_url": "https://api.github.com/users/i-vetrov/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/i-vetrov/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/i-vetrov/subscriptions",
    "organizations_url": "https://api.github.com/users/i-vetrov/orgs",
    "repos_url": "https://api.github.com/users/i-vetrov/repos",
    "events_url": "https://api.github.com/users/i-vetrov/events{/privacy}",
    "received_events_url": "https://api.github.com/users/i-vetrov/received_events",
    "type": "User",
    "site_admin": false
  }
};
var parseGitHub = function(requestBody, project) {
  requestBody = githubTest;
  if(!!requestBody.repository) {
    if(project.webhookPath.match([requestBody.repository.full_name])) {
      if(project.gitBranch === requestBody.ref.substr(11,requestBody.ref.length + 1)) {
        var notificationData = {};
        notificationData.branch = requestBody.ref.substr(11,requestBody.ref.length + 1);
        notificationData.pusher = requestBody.commits[0].committer.username;
        notificationData.commitComment = requestBody.commits[0].message;
        return notificationData;
      } else {
        console.log('@parseGitHub: wrong branch name');
      }
    } else {
      console.log('@parseGitHub: wrong repository name');
    }
  } else {
    console.log('@parseGitHub: wrong data format');
  }
  return {};
};


/**
 * Retrieving information for further notification
 * @function retrieveNotificationData
 * @param {object} request - http request object
 * @param {object} project - project object from config.json
 * @returns {object} - notification object of empty one if unknown git host made a request
 */
var retrieveNotificationData = function(request, project) {
  var data = {};
  if(request.hasOwnProperty('headers') && request.headers['user-agent'] !== null) {
    if(request.headers['user-agent'].match(/bitbucket/i)) {
      data = parseBitBucket(request.body, project);
      data.host = 'BitBucket';
    } else if(request.headers['user-agent'].match(/github/i)) {
      data = parseGitHub(request.body, project);
      data.host = 'GitHub';
    }
  }
  data.path = project.webhookPath;
  return data;
};
exports.retrieveNotificationData = retrieveNotificationData;
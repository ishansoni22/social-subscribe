# Social Subscribe
The goal of this library is to provide an abstraction over most popular social networks for subscribing to 
user activity.

In it's current state it can help to subscribe users facebook pages. It will give you an event emitter which emits events like "post", "comment" etc. with the 
update as soon as there is any activity on pages. 

## Installation
You can install this package from npm via following command 
```sh
npm install social-subscribe@alpha
```

## How to use
coming up ...

Use cases
---------
  This can be used when application needs to get continuous updates of the user from social networks to process the 
  update and perform certain analysis on it. 
  
  This library helps in quick bootstrapping of social subscription 

How it works
------------
coming up ...

Future Plan
------------
Currently this library does not consider the social API call limits. We plan to add that in future as of now the API
 limits are expected to be handled by application.

Library has included recipe in itself. We plan to separate it so that it can grow on it's own, in areas like
 adding more events for subscription and specialised API calls per social network. 

We will also provide helper functions which will include independent API calls that we make to do subscription, along 
 with specialised API calls per social network to ease the integration. The helper functions 

## TODO
- [ ]  Add documentation for Installation
- [ ]  Add documentation for How to use
- [ ]  Add documentation for How it works
- [X]  Create NPM package
- [ ]  Add code coverage

# KitPrep
The emergency preparedness kit preparator. Made with [Create React App](https://github.com/facebook/create-react-app) and [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter).

## Installation
1. Run `npm install` in the project directory.
2. To start the app with :fire: reloading, run `npm start`.

## Deploying to Firebase
1. Install the Firebase CLI with `npm install -g firebase-tools`.
2. Run `firebase init` in your project directory and follow the setup guide. Select 'yes' if asked if you want to configure your app as a single-page app. Select 'no' if asked to overwrite `build/index.html`.
3. Now install Firebase itself with `npm install --save firebase`.
4. Create a file called `fire.js` in the `src` directory.
5. Create a Web project in Firebase and copy the apiKey, authDomain, etc. from the Firebase console into `fire.js`:
```javascript
// src/fire.js
import firebase from 'firebase'

var config = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    databaseURL: "your-db-url",
    projectId: "your-project-Id",
    storageBucket: "",
    messagingSenderId: "your-sender-id"
}
var fire = firebase.initializeApp(config)

export default fire
```
6. Set your Database rules in `databse.rules.json` according to the [Firebase guidelines](https://firebase.google.com/docs/database/security/).
7. Run `npm run build` and `npm run deploy` to build the app and deploy it to Firebase hosting.

Credit for Deploying Steps to [Codementor/Yuriy Linnyk](https://www.codementor.io/yurio/all-you-need-is-react-firebase-4v7g9p4kf).
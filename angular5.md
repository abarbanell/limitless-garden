# Angular 5 setup

We have here a node / express application and want to serve an angular frontend. 

So we want to use npm as task runner, but webpack / jasmine for the frontend.

# Starting point

References: 

- Angular 5 [upgrade guide](https://angular-update-guide.firebaseapp.com/)
- Angular 5 [upgrade and summary of new features](https://alligator.io/angular/angular-5/)
- Angular 5 [Release Announcement](https://blog.angular.io/version-5-0-0-of-angular-now-available-37e414935ced)
- Angular CLI [github repo](https://github.com/angular/angular-cli#generating-and-serving-an-angular-project-via-a-development-server)

# Angular CLI

We need Angular CLI version 1.5+: 

```
npm install -g @angular/cli
````

If you have an existing project, you should add the cli to the dev dependancies: 

```
npm install --save-dev @angular/cli@latest
```

Note: I got a warning: 

```
npm WARN ajv-keywords@2.1.1 requires a peer of ajv@^5.0.0 but none is installed. You must install peer dependencies yourself.
```

Note2: 

limitless garden runs already on Typescript 2.5.2 - not sure Angular can handle this, most documentation shows Typescript 2.4.2





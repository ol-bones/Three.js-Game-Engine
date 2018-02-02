# Public Demo

http://sarian.world/

Username: guest@guest.com
Password: guest

# Installation & Use

Download and install: git, node, mongodb#

Download and place models, physics models, textures and material in assets folder

(.obj, _phys, .jpg and .jpg -- gitignored due to file sizes)

> #### First Use
>```
>> sudo service start mongod
>```
>```
>> npm install
>```

```
> sudo node server.js
```

Go to: (ip):80

Registering an account restricts users from viewing the game page using the "Access" user model property. Change the default value upon registering, manually create a user in the mongo console or change the value for viewing the page. But don't commit that.

# Brief code description

This is a game engine, and game development tool

The server (server.js etc) controls serving the client as well as file management

The client game code is contained in /public/js/, with some server-side rendering in /app/views/

Client entry points:
* Game and gameplay features start in Game.js
* World editor starts in /editor/edit/Editor.js
* Entity creator starts in /editor/entitycreate/EntityCreate.js

https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system
https://threejs.org/docs/#manual/introduction/Creating-a-scene

Uses three.js webgl rendering, cannonjs physics, vanilla es6 js, component & mixin architecture

Will support small and open worlds, currently singleplayer only

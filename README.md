# Installation & Use

Download and install: git, node, mongodb

> #### First Use
>```
>> sudo service start mongod
>```
>```
>> npm install
>```

```
> node server.js
```

Go to: (ip):80

Registering an account restricts users from viewing the game page using the "Access" user model property. Change the default value upon registering, manually create a user in the mongo console or change the value for viewing the page. But don't commit that.

# Brief code description

The client game code is contained in /public/js/
main entry point for client code goes app.js -> Game.js -> World.js
main entry point for server goes server.js -> everything else

https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system
https://threejs.org/docs/#manual/introduction/Creating-a-scene

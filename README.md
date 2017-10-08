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

Go to: (ip):5000

Registering an account restricts users from viewing the game page using the "Access" user model property. Change the default value upon registering, manually create a user in the mongo console or change the value for viewing the page. But don't commit that.

# HOW TO CONTRIBUTE NICELY

1. Create your own branch (YourName-dev)

```
> git checkout -b "YourName-dev"
```

2. Always commit and push to YourName-dev or a specific feature branch (FeatureName-dev e.g. PlayerPhysics-dev)

3. When you have a completed change which doesn't interfere with other stuff,
   make a pull request from your branch to master with master as base.
   
   If you want someone else to check it over or something set them as a reviewer and specify a branch they can pull and test your changes
   
## BEFORE YOU BEGIN CODING:

>git checkout master

>git fetch --all

>git pull

>git checkout YourName-dev

>git merge master

>... continue coding...

>git commit -m "Adds -brief description-" -m "    * Bullet point summary" -m "    * More summary"

>   or
   
>git commit --amend
   
>git push -u origin YourName-dev

Then make a pull request via web interface


# DEVELOPMENT NOTES

O: I am making Physics, then Texturing, then Open World, then Level Editor

### Open Tasks (add stuff here as it's thought of I guess)
Engine development tasks: Asset management/loading/rendering, skeletal/human mesh body, activatable entities (doors, light switches, etc), AI (enemies, companions, npcs (dialogue and events and other capabilities?)), items, weapons, follow camera, start to replace existing intercomponent communication with THREE.dispatchEvent? (not sure)

Game development tasks: html5/css user interface, cutscenes, quests, inventory, WASDPlayerControlComponent space bar jumping / directional follow camera relative movement

Web tasks: stop webgl renderer using the body element as it is persistent between page changes(?), make a config for serving the app with dev preferences like ip to serve etc and add it to .gitignore

# Brief code description

The client game code is contained in /public/js/

main entry point for client code goes app.js -> Game.js -> World.js

World.js currently sets the default scene entities etc

main entry point for server goes server.js -> everything else

https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system
https://threejs.org/docs/#manual/introduction/Creating-a-scene

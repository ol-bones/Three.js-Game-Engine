| Minigolf Test Video | Editor UI |
| ------------- | ------------- |
| [![YouTube](https://img.youtube.com/vi/lOMJUnvHzDo/0.jpg)](https://www.youtube.com/watch?v=lOMJUnvHzDo "YouTube") | ![](https://i.imgur.com/kdRHfP7.png) |



# Installation & Use

Download and install: git, node

> #### First Use
>```
>> npm install
>```

```
> npm run dev
```


# Brief code description

This is a game engine, and game development tool

The server serves resources (textures, models, etc)

Client entry points:
* Game and gameplay features start in Game.js
* World editor starts in /editor/edit/Editor.js
* Entity creator starts in /editor/entitycreate/EntityCreate.js

https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system
https://threejs.org/docs/#manual/introduction/Creating-a-scene

Uses three.js webgl rendering, cannonjs physics, vanilla es6 js, component & mixin architecture

Will support small and open worlds, currently singleplayer only

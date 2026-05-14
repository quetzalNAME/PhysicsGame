# Paper Physics
https://quetzalname.itch.io/paper-physics

# Experience Requirements:
- ## The game uses both continuous (e.g. touch x/y over time) and discrete (e.g. button event) inputs from the player
  The core mechanic of controlling a robot arm with a trackpad allows for both input types, the continuous control is obvious, but if you are playing on a phone you can simply tap on a position on the trackpad to move the arm.

- ## The player’s goal can only be achieved indirectly (by allowing the physics engine to move key objects into position/contact).
  The whole game is completing simple goals through the robot arm and the physics engine.

- ## 3+ physics-based gameplay scenes (possibly implemented with a single Phaser Scene subclass).
  - Tutorial where you learn the trackpad and collect stars.
  - Baseball level where you try to hit a paper ball as far as possible.
  - And a drawing level where you catch falling stars.

- ## Other scenes are used to separate and contextualize the gameplay scenes
  After the gameplay scenes there are level summaries that pop up to give you a score and navigation options. (Replay, Next level, Level Select Screen)

# Assets:
- All of the game assets were made by me. For this project my workflow ended up being:
- Rough drawing -> Take picture -> Mask using Inkscape -> Optional recoloring directly in Phaser
- Many of the images I needed I could have found online, like the pencil, the paper ball, or the background. But it was fun to do it myself, and certainly helpful for skill development.

It is worth mentioning that the code for drawing smooth lines in the drawing level is taken from a [Phaser labs example](https://labs.phaser.io/phaser4-view.html?src=src%5Cphysics%5Cmatterjs%5Cdraw%20smoother%20stiff%20line.js&return=phaser4-index.html%3Fpath%3Dphysics%252Fmatterjs), and simply modified to follow a matter physics object instead of the cursor.

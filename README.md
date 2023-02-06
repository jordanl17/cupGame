## CUP GAME
### scripts
* `npm run dev` - will start the dev serve running on port `8080`
* `npm t` - will run a suite of unit and e2e tests

### Game Features
There are 3 difficulty levels broken down as follows
* EASY - this level shows 3 cups, and uses slow motions to shuffle the cups 5 times. The shuffle strategy will pick 2 cups and swap them with one another before starting another shuffle iteration. A win here gains 1 point. A loss here loses up to 1 point.
* MODERATE - this level shows 3 cups, and uses slightly faster motions to shuffle the cups 7 times. The shuffle strategy will aim to move at least 2 cups per shuffle, sometimes moving all 3 cups at once. A win here gains 2 points. A loss here loses up to 2 points.
* HARD - this level shows 4 cups, and uses much faster motions to shuffle the cups 10 times. The shuffle strategy will, like MODERATE, aim to move at least 2 cups per shuffle, something moving all cups at once. A win here gains 5 points. A loss here loses up to 5 points.

### Architecture
The source is broken down into the following directories and files
* `/components` holds atoms (small individual presentation of minimal logic holding components); and molecules (larger components, such as orchestration of multiple atoms in `Controls`) 
* `/constants` has constant values used for controlling animation times and difficulty settings
* `/contexts` defines a `gameState` context which is globally accessible to all components, holding information on the current state of the game round and overall game play
* `/reducers` where a `gameState` reducer is specified which allows for game progression in a state-machine-esque way

### Implementation
The following packages have been used:
* `vite` for lightweight build and dev server hot reloading capabilities
* `react` for managing logical componentialisation and DOM orchestration
* `testing-library/react` for all unit and e2e test scripting
* `jest` as test runner
* `babel` for transpiling typescript files to javascript

[`Game.tsx`](./src/Game.tsx) is where the instatiation of the game state context is created. This wraps all the underlying parts of the game, the points callout, the game message, the playing field (where the cups and ball exist) and the controls (to start the game and select difficulty).

[`Points.tsx`])() and [`GamePrompt`]() are mostly simplistic components just connecting to the game state context.

[`Controls`]() is a molecule which is also rather simple. It has a single CTA to start the game, which when clicked will dispatch an action to the game state reducer to begin the game round; and a difficult dropdown, will will pass the difficulty back up to `Game.tsx`. `difficulty` was not included in the game state context as it is only needed in the highest most levels of the component tree - Controls and `PlayingField`.

[`PlayingField.tsx`]() is where the vast majority of the game play logic is held. The `startGame` fnc will be triggered after the CTA is clicked to start the game. This will initially randomly select a cup from those available to place the ball. After tilting the cup to reveal the ball location, `makeAllShuffles` will then be triggered. Depending on the difficulty selected this will run a loop of 5, 7 or 10 shuffles. `setTimeout` is used across implementation to achieve the animation states of the ball and cups. Animation speed is difficulty dependent, and the speed at which the sync for loop is executed determines how quickly the position of the cups is changed. A call is made to `applyShuffleStrategy` which will generate a new order of cup positions based on the difficulty's shuffle strategy. Finally, once the last shuffle is completed, it will trigger the `onComplete` cb which will progress the game to the guessing phase.

All cups are now clickable (until this point clicking on them would have no action). Once the user clicks on a cup, the game enters the terminal state - `WIN` or `LOSE`. The dispatch of an action to the game state reducer called `guessResults` will result in an increment or decrement of the user's score. The user will then be able to begin a new round, or change the difficulty.

#### Animation and game phases
To build the synchronous gameplay states the concept of game phases is introduced. The phases are:
* `INIT` the dormant state used at the startup of the app
* `START` a state used to indicate that the user has clicked the start game CTA
* `PLACING_BALL` which represents the period where a cup is randomly picked to hold the ball, and that cup is tilted to reveal the ball
* `PLACED_BALL` to mark the end of the ball placing phase. This state is required to allow for animation time for the tilt of the cup (both up and down) to proceed
* `SHUFFLING` represents the period of time underwhich cups are moved from each position to another. During these phases the ball is not rendered in the DOM
* `SHUFFLED` which marks the start of the guessing phase of the game. At this point, progressing to the next game phases required user input by clicking on a cup
* `WIN`/`LOSE` which is the terminal game phase to mark the result of the round. This will also trigger the cup which held the ball the reveal itself

#### Preventing cheating
To ensure that the location of the ball was held only within JS memory during the shuffling and guessing phases, each cup, although told whether it holds the ball (simply to allow for the cup tilt animation), does not change the JSX output based on whether it holds the ball. In other words, going into the element devtools during the shuffle or guessing portions of the game - these is no difference, either to styling or to DOM elements, between each of the cups. The only way of determining which cup holds the ball is to follow the motion of the cup on the screen.

#### Cup Positions data model
Each cup, at any time, knows information on its start position and its current position. The cups themselves do not move order within the DOM tree, but rather change their style (left attribute) to allow for animation from position to position.

To represent these 2 data points, a simple `number[]` is used. At the start of a game, before any shuffle has taken place, this would look like `[0,1,2,3]`, which represents 4 cups, where each cup is in the correctly ordered position. Consider this as saying 'cup 0 is in position 0; cup 2 is in position 2'. Say the ball is placed at cup 2. After one shuffle this data structure now looks `[1,3,0,2]` which represents that the cup that started in the first (left most) position, is now in position 2 (the second left most position, or index 1). Meanwhile cup 2 - that holds the ball, is now the left most cup, in position 0. The integers in this structure as used in conjunction with the index of the element to determine to current and initial cup. The index represents the cup number. The value represents the position.

#### Shuffle strategies
The simple strategy [`twoAtATime`]() implements the following logic:
1. 2 current (cup) positions are selected at random
2. if the 2 random positions are the same, then 2 new positions are chosen
3. if the positions are unique, then a loop is run through the current positions
4. when the first position is reached, the cup there is 'moved' to the second position
5. vice versa happens when the second position is reached - it is moved to the first position

A more complex routine is followed for [`moveThemAll`]() to ensure that at most, only 1 cup retains its position in a shuffle. In the HARD difficulty, this means that on every shuffle at least 3 cups move
1. First, a new position is generated for the first cup
2. The `placeRemainingCups` fnc is then recurively called, each time being told the now filled positions from which it can no longer place.
3. The second cup then has a random position chosen from those still empty
4. this continues until there is only 1 more cup to place. At this point the position is determinable, and so the only empty position is assigned to the last cup
5. A final check is performed to ensure that the proposed new order for the cups has, at most, only 1 cup retaining it's original pre-shuffle position
6. If 2 or more cups have not moved, then the shuffle is performed again

### Testing
Tests cover unit tests for molecules (excluding `PlayingField`) and atoms; tests for the shuffle logic implementations; and for the game state reducer.

E2E tests ensure correct integration of all components to form coherent game play.
## **Cyclomatic Complexity Analysis (Arteen Ramezani):**

For this task, I analyzed the bot by measuring the cyclomatic complexity of its methods, with a primary focus on the trivia command where most of the core logic for our bot is. I reviewed the code to identify decision points such as conditional statements, loops, and error-handling paths that increase the number of possible execution flows within each method. This analysis showed that most helper functions fall within a low to moderate complexity range, which is good. But, two outliers are the main `execute(interaction)` handler and the `getRandomItunesTrack` method that have significantly higher complexity due to a lot of branching and control flow. Although the bot functions correctly, these areas represent higher risk for maintenance and testing because of the number of possible paths through the code.

### **Cyclomatic Complexity by Method**

- `execute(interaction)` → ~45 (**Very High**)  
- `getRandomItunesTrack` → ~20 (**High**)  
- `isCorrectGuess` → ~9 (**Moderate**)  
- `findTextChannel` → ~9 (**Moderate**)  
- `requestBuffer` → ~6 (**Low–Moderate**)  
- `cleanupSession` → ~5 (**Low**)  
- `ensureVoiceConnection` → ~5 (**Low**)  
- `normalizeString` → ~3 (**Low**)  



## **Cohesion and Coupling Analysis (David Hochberg):**

In software engineering, cohesion is when a function operates as its own unit, creating a stable and efficient architecture. Contrarily, coupling occurs when there are many interdependencies between the features of the project. I analyzed our bot’s architecture and code to determine which aspects are cohesive and what is coupled. From this, I found that most of our bot is cohesive. However, player interactions are currently coupled, with multiple components sending messages to the players.

### **Cyclomatic Complexity of Different Functionalities**

What is cohesive in our current design/architecture:
- **Score count**: Keeps track of itself and has methods to call it from other files.
- **Rules**: Is its own, separated feature with few connections.
- **Data for questions**: It’s stored in its own file that other files can interact with.
- **Playing music in voice chat**: neatly put into 2 files with one method to call it.

What is coupled in our current design/architecture:
- **List of players / player interaction**: there are many things that interact with the players (send messages, etc) but no dedicated object to manage players

What is in the middle (could be improved, but not the worst):
- **Getting songs from iTunes API**: We currently have two methods for this in two places: getRandomItunesTrack in trivia.js and getRandomItunesPreview in game.js. Could be put into its own cohesive object, which would also remove the repetition.

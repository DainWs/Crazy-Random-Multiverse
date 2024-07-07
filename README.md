# Crazy Random Multiverse

## Welcome to CRM game

Developers, you can't contribute to this project, but you can still fork it, and implements your own logic/style!!

This is exciting, isn't it? 😆 

### But, why should I fork it?

We knew you would ask this, so we will answer you, currently the game that you find in the repository contains a series of predefined cards, effects and actions, that is, the reason for making a fork is to be able to add custom effects, actions and cards!! 😍

### How can I understand the code structure of the project?

That's easy my dear developer, you can find all domain models, class diagrams or other type of diagrams in [docs/development](docs/development/) 😜

Take a good look and enjoy it. 🌹

### Lets run the project

So, lets starts running the server-side project (or java project) running this command:

```bash
mvn spring-boot:run
```

When you have the server side project running, you can start running the client-side running this commands:

```bash
npm install --prefix 'client/'
npm run --prefix 'client/' serve
```

Now you can access to application via client-side open ports.

### To include client-size/frontend in server-side/backend

Sorry, this is not implemented yet 😥

## Requirements

You can find the requirements [here](docs/Requirements.md)

## Features

Did you think we wouldn't prepare the project to be easy to reuse? We think you were wrong, here you have a list of 
current and future features that will make the project more ease to reuse:

 - Persistence
 	- [X] Memory persistence implementation (Cards, Games, Parties and Users)
 	- [ ] XML File persistence implementation (Cards, Games, Parties and Users)
 	- [ ] JSON File persistence implementation (Cards, Games, Parties and Users)
 	- [ ] DB persistence implementation (Cards, Games, Parties and Users)

 - Languages
 	- [X] Custom language implementations.

 - Coding
 	- [X] Users custom implementations with **java**.

but otherwise, we don't plan to implement the following (for now, maybe tomorrow?)

 - XML Effect definitions file 
 - JSON Effect definitions file

Why we don't plan to implement that feature, its the most beautifull of this project? the response is _no_, these feature can only be implemente with custom expression logic language, and its a big deal for we. 😭


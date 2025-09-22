# Overview

this is a simple app that is building the fundamentals of creating a full-stack web application. The app allows the user to track olympic medals earned for any country. They can keep track of all medals from every country. within each country they can see the total medals and the specific amount for each medal type(gold, silver, bronze). The user can delete the country as a whole and increase/decrease each medal count in each country.

## tech stack in use

### backend

- sqllite

- swagger for documentation

- both these need to be implemented. Thats where you come in!

### Frontend

- react

## project and code guidlines

- always follow RESTful API design principles

## project structure

- src/components/ : react components

### instructions

Create a RESTful API for the Olympic Medals application. Be sure to utilize Swagger for documentation. You should include the following http methods:

http get to return a specific country - /api/country/2
http get to return the entire collection of countries - /api/country
http post to add a new country - /api/country
http delete to delete a country - /api/country/2
Ultimately, we will need a method to edit an existing country (increase/decrease medal count), however, we will add that later

You can use sqlite. Do NOT fully normalize the database - you should only use 1 table to store:

Id (identity, pk, int)
Name (string)
Gold (int, default value=0)
Silver (int, default value=0)
Bronze (int, default value=0)

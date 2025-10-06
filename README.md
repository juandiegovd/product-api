## PRODUCT API
This is a NestJS API that synchronizes data from an external API to our database and can perform operations on them.

## SET UP
- Define the .env file with the properties, you can check the properties in the following link: https://pwpush.com/p/kug1fu4jgmzhcw90nw/r
- Run the docker-compose.yml file to deploy the app and the database in local env
- If you want to drop the database and create again the table, you can do it using npm run migration:run

## CONSIDERATIONS
- There is no validation for the username and password in the auth since there are not valid or invalid users in the project at the moment
- E2E tests has been created for the report and product controller
- No custom exceptions have been created for this project

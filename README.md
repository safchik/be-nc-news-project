# Northcoders news

## Summary

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service, which should provide this information to the front end architecture.

## Installation

To run the API locally, you'll need to have the following software installed:

Node.js (v14.15.4 or later)
PostgreSQL (v12 or later)

To install the API:

Clone this repository to your local machine;
Navigate to the root directory of the project in your terminal;
Run `npm install` to install the project's dependencies;
Create a local PostgreSQL database for the API to use;
Create two environment files .env.development and env.test in the root directory of the project, and add the necessary environment variables to connect to the development and test databases, respectively (see the "Env files" section for more details);

Run `npm run seed` to seed the development database with some initial data
Run `npm test` to run the project's tests and ensure everything is working as expected
Run `npm start` to start the API and make it available on `http://localhost:9090`


## Env files

To successfully connect two databases locally, developers will need to create two environment files `.env.development` and `env.test`. These files should contain the necessary environment variables to connect to the devellopment and test databases respectively.

In the root directory of the project, create a new files  `.env.development` and `env.test`.

Open them in a text editor, add `PGDATABASE=<database_name_here>` and replace the values for each environment variable with the corresponding values for your local set up.

Once you have created these files, you should be able to connect to the development and test databases locally. 

Make sure `.env.development` and `env.test` files are added to `.gitignore` file as this ensures that sensitive information like passwords and host URL's are not accidentally exposed.

## Endpoints

The API has the following endpoints:

`GET /api/topics`: Retrieve a list of topics
`GET /api/articles`: Retrieve a list of articles
`GET /api/articles/:article_id`: Retrieve an article by its ID
`GET /api/articles/:article_id/comments`: Retrieve a list of comments for an article
`POST /api/articles/:article_id/comments`: Post a new comment to an article
`PATCH /api/articles/:article_id`: Update an article's vote count
`DELETE /api/comments/:comment_id`: Delete a comment

Each endpoint has been designed to handle various possible errors and send appropriate HTTP status codes to the client.

For more information on each endpoint and how to use them, see the endpoints.json file.

## Using NC News

A working example of this demo is published at: `https://nc-news-project5.onrender.com`

## Author

Dmytro Savka - Northcoders Student - northcoders.com
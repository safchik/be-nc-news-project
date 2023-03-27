# Northcoders news
## Env files

To successfully connect two databases locally, developers will need to create two environment files `.env.development` and `env.test`. These files should contain the necessary environment variables to connect to the devellopment and test databases respectively.

In the root directory of the project, create a new files  `.env.development` and `env.test`.

Open them in a text editor, add `PGDATABASE=<database_name_here>` and replace the values for each environment variable with the corresponding values for your local set up.

Once you have created these files, you should be able to connect to the development and test databases locally. 

Make sure `.env.development` and `env.test` files are added to `.gitignore` file as this ensures that sensitive information like passwords and host URL's are not accidentally exposed.
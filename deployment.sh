# This script is to restart the server in production mode.
# This will install all the required libraries.
git pull origin master
npm install
npm run start:prod
npm run stop:prod

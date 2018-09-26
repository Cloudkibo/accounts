# This script is to restart the server in production mode.
# This will install all the required libraries.
git pull origin master
npm install
npm install --only=dev
npm run stop:prod
npm run start:prod

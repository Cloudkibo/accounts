# This script is to restart the server in production mode.
# This will install all the required libraries.
git pull origin staging
npm install
npm install --only=dev
npm run stop:staging
npm run start:staging

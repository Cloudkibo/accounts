# This script is to restart the server in production mode.
# This will install all the required libraries.
git pull origin staging
npm install
npm install --only=dev
forever stop server/app.js
forever cleanlogs
forever start server/app.js

# This script is to restart the server in production mode.
# This will install all the required libraries.
git pull origin master
npm install
npm install --only=dev
forever stop server/app.js
forever start server /app.js

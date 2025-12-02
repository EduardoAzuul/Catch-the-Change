# Catch the Change

## Prerequisites
- Node.js (v16+ recommended)
- npm
- A running MongoDB instance (local or Atlas)

## Install all dependencies
From repo root:
```bash
npm run install-all

## Install dependencies manually

# root (client)
npm install

# server
cd server
npm install

## Create .env
MONGODB_URI
MY_ID_GOOGLE
REACT_APP_API_URL
REACT_APP_EMAILJS_SERVICE_ID
REACT_APP_EMAILJS_USER_ID
REACT_APP_EMAILJS_TEMPLATE_ID

##Running
 
 #Run server and client
 npm run start-dev

 #Run server in terminal 1
 cd server
npm run dev 
#or
npm start

#Run client in terminal 2
npm run client
# or
npm start
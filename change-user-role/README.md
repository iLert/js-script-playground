# ilert user role changed script

This script has been designed to help changing the role of user (identified by email).
If the user is a member of teams he will be temporarily removed from them.

## Setup

- Node.js version >= 14 is required (we recommend [NVM-Node](https://github.com/nvm-sh/nvm))
- Clone this repository `git clone git@github.com:iLert/js-script-playground.git`
- Change to this directory `cd change-user-role`
- Install dependencies `npm install .`
- You need an API key for your ilert (admin) user (you can get that in the web UI app.ilert.com)
- You have to provide the API key as environment variable `ILERT_API_KEY` you can do that either by passing it to the script or by creating a `.env` file containing the var e.g. `ILERT_API_KEY="{YOUR_ILERT_API_KEY}"`

## Running the script

```
ILERT_API_KEY="your-api-key-here" npm start email="example@example.com" role="RESPONDER"
```
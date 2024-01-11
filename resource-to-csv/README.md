# ilert user role changed script

This script helps you to grab a list of specific resources and store them into a CSV file.

First of all, before using this script, check if the corresponding UI list in the web app app.ilert.com does not already support a CSV download e.g. users or teams.
Then grab the name of the API resource from api.ilert.com e.g. for `Status pages` its `status-pages` and use that to run the script and export the CSV data.

## Setup

- Node.js version >= 14 is required (we recommend [NVM-Node](https://github.com/nvm-sh/nvm))
- Clone this repository `git clone git@github.com:iLert/js-script-playground.git`
- Change to this directory `cd resource-to-csv`
- Install dependencies `npm install .`
- You need an API key for your ilert user (you can get that in the web UI app.ilert.com)
- You have to provide the API key as environment variable `ILERT_API_KEY` you can do that either by passing it to the script or by creating a `.env` file containing the var e.g. `ILERT_API_KEY="{YOUR_ILERT_API_KEY}"`

## Running the script

```
ILERT_API_KEY="your-api-key-here" npm start resource="status-pages" 
```

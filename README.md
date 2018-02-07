# LIRI Bot
## Language Interpretation and Recognition Interface

### How LIRI works

LIRI understands command line requests formatted like this:
- `node liri.js my-tweets`
  - This will show your last 20 tweets.


- `node liri spotify-this-song '<song name here>'`
  - This will display information about that song in the terminal window.


- `node liri.js movie-this '<movie name here>'`
  - This will display information about the movie in the terminal window.


- `node liri.js do-what-it-says`
  - Uses the text inside of random.txt to call one of LIRI's commands.

### API Keys

Users who clone LIRI from github will need to supply their own .env file for it to work.

#### Create .env
- Create a file named .env, add the following to it, replacing the values with your API keys (no quotes) once you have them:
  ```
   SPOTIFY_ID=your-spotify-id
   SPOTIFY_SECRET=your-spotify-secret

   TWITTER_CONSUMER_KEY=your-twitter-consumer-key
   TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
   TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
   TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret
  ```

#### Get your Twitter API keys:

-   **Step One:** Visit https://apps.twitter.com/app/new

-  **Step Two:** Fill out the form with dummy data. Type http://google.com in the Website input. Don't fill out the Callback URL input. Then submit the form.

-  **Step Three:** On the next screen, click the Keys and Access Tokens tab to get your consume key and secret.
  Copy and paste them into your .env file, replacing the `your-twitter-consumer-key` and `your-twitter-consumer-secret` placeholders.

-  **Step Four:** At the bottom of the page, click the Create my access token button to get your access token key and secret.  Copy and paste them into your .env file, replacing the `your-access-token-key` and `your-twitter-access-token-secret` placeholders.

#### Get your Spotify client id and client secret
-  **Step One:** Visit https://developer.spotify.com/my-applications/#!/

-  **Step Two:** Either login to your existing Spotify account or create a new one (a free account is fine) and log in.

-  **Step Three:** Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.

-  **Step Four:** On the next screen, scroll down to where you see your client id and client secret. Copy these values into the .env file replacing the  `your-spotify-id` and `your-spotify-secret` placeholders.

## Technical Notes

Liri Bot uses these modules:

- dotenv  https://www.npmjs.com/package/dotenv
  A module that loads variables from a .env file into a computer's environment.  This in conjunction with exported objects in file.js make it possible to deliver Liri Bot without exposing the developer's Spotify and Twitter keys.  See **Create .env** above.
- fs -- fs is a builtin node.js module that gives access to files on the computer.
- request  https://www.npmjs.com/package/request
  Simplifies making HTTP API calls.
- twitter  https://www.npmjs.com/package/twitter
  The Twitter API
- node-spotify-api  https://www.npmjs.com/package/node-spotify-api
  The Spotify API.
- inquirer  https://www.npmjs.com/package/inquirer 
  For command line menus.  I'm not interesting enough to come up with 20 tweets so I added a menu to select four interesting Twitter feeds.  (Seriously, check them out.)



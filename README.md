# Lucky Dog
because all dogs should be lucky
## Preparing the Application
You'll need to create a `.env` file in your lucky-dog project directory before you can start, and you'll need to add to it the following values:

```
REACT_APP_FETCH_API_URL = https://frontend-take-home-service.fetch.com
REACT_APP_FETCH_API_KEY = {PUT YOUR FETCH TAKE-HOME API KEY HERE}
REACT_APP_GEO_API_URL = https://api.opencagedata.com
REACT_APP_GEO_API_KEY = {PUT YOUR FREE OPENCAGE GEO API KEY HERE}
```

You should already have a REACT_APP_FETCH_API_KEY.
To get a REACT_APP_GEO_API_KEY, go to [https://opencagedata.com/](https://opencagedata.com/) and sign up for a free account. Once you have done that, you should be provided with a free key that will work for this project.

Once your `env` values are set up, you should be ready to launch.

## Launching the Application

In the project directory, you can run:

### `npm start`

This runs the React frontend of the app.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Using the Application

Using the lucky dog application is pretty simple. Once you have configured and launched the app, you will see a homepage.

Click the "Find your Lucky Dog" button and you can get started.

From there, you'll need to provide some information. It doesn't really matter if the information you provided is correct, since the application is not capable of actually interacting with anything outside itself, besides the sample APIs.

Just make sure the email address looks like a valid email, and you're good to go. The application itself won't ever send any emails.

After that, click "View Dogs". You should now go directly to the dog search.

From here, you can:
1. Just start typing a location and will automatically see some dogs
2. Specify some state filters in the dropdown to limit what states your dogs will be in
3. Add a range to the search, which will futher refine the search to be within that distance from the searched location

You can also:
1. Select certain breeds to limit results to
2. Toggle the sort on the results to be alphabetical by breed either ascending or descending

When you see a dog you like, simply drag it to the right column (or press the small arrow on the dog's card)

From here, you can:
1. Keep searching for more dogs, change the pages, modify the filters, etc and your favorited dogs will remain on the right side
2. Drag any dogs you changed your mind about back to the left column, and they will be returned to their original place in the list

* Because there is no server to manage the session, your favorited dogs will reset on page reload. Your logged in state, however, should remain in your cookies for 1 hour, allowing you to search freely for 1 hour before needing to log in again.

Finally, when you are done selecting favorited dogs, you can:
* Click on the large green arrow on the bottom right of the page to generate a match.

After that, you've got a match and you're pretty much done. Just click the "Contact Shelter" button to finish and get a brief wrap up of the application.


*note: 
Dog images provided by Chatra Ardhisuryo on Vecteezy (https://www.vecteezy.com/members/111949329455010509463) and additional images by rawpixel.com.
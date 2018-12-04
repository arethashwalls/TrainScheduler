# All Aboard!
## A simple application using localStorage to display fictional train schedule data.

**All Aboard!** was written as a homework assignment for the UA Coding Bootcamp. Primary objectives were practice with localStorage and ES6 syntax.

### Files:
* `index.html` contains the application's HTML content.
* `assets`
  * `images`
    * `train-icon.ico` is this page's favicon.
    * `train.jpg` is the background image used in the header.
    * `wallpaper.jpg` is the background image used in the page body.
  * `js`
    * `app.js` contains the app's core JavaScript.
  * `style`
    * `webfont` contains webfont files.
      * `open-iconic.eot`
      * `open-iconic.otf`
      * `open-iconic.svg`
      * `open-iconic.ttf`
      * `open-iconic.woff`
      * `rye-regular-webfont.woff`
      * `rye-regular-webfont.woff`
    * `open-iconic-bootstrap.css` is Open Iconic's stylesheet.
    * `style.css` is the app's custom stylesheet.

### External Assets:
[Boostrap](https://getbootstrap.com/)
[Open Iconic](https://useiconic.com/open)
[Moment.js](https://momentjs.com/)
[JQuery](https://jquery.com/)

### Application:
First, the **Train** object is defined on **lines 3-65**. *Train*'s constructor accepts four parameters: name, destination, start, and frequency.
**Lines 11-20**: Three getters are defined:
* `now()` returns the current time as a moment.
* `nextTime()` calls the `findNext()` method to return the next arrival time.
* `minAway()` calls the `findMinAway()` method to return the time until the next arrival.
**Lines 34-64**: Five methods are defined:
* `findNext()` takes the given start time and iterates it by the train's frequency until it arrives at a time after `now`.
* `findMinAway()` returns the difference between `now` and `nextTime`.
* `makeRow()` returns a `<tr>` element displaying the train's data.
* `addToAllTrains()` adds the current train to the `allTrains` array.
* `removeFromAllTrains()` removes the current train to the `allTrains` array.
**Line 68** retrieves the `storedTrains` array from local storage.
**Line 71** disables the clear button if no trains are currently being displayed.
**Line 74** recreates each object in `storedTrains` as a *Train* object.
**Line 77** creates a `<td>` element from each train in `allTrains` and appends it to the display table.
**Line 80-110**: On submitting the train creation form:
  * **Lines 84-85** resets changes made by the edit button.
  * **Lines 87-92**: A new train is created from the form values.
  * **Lines 94-103** check for trains with duplicate names and add a digit to the end of the name if necessary.
  * **Line 105** makes the clear button available.
  * **Line 107** adds the new train to the `allTrains` array.
  * **Line 109** adds a new row to the display table based on the new train.
**Lines 113-118**: On clicking the clear all button, all trains are deleted and the table is cleared.
**Lines 121-127**: On clicking the individual remove button, the selected train is removed from `allTrains`, local storage, and the page.
**Lines 129-143**: On clicking the update button, the selected train is removed and its values are put back in the form for editing.

## TODO
* ~~Clean and comment code~~
* ~~Forbid duplicate names to avoid issues~~

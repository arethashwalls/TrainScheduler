$(document).ready(function () {
    /*Construct the Train class: ***********************************************************/
    class Train {
        constructor(name, destination, start, frequency) {
            this.name = name;
            this.destination = destination;
            this.start = start;
            this.frequency = frequency;
        }
        /* Getters: ************************************************************************/
        get now() {
            //Train.now is the current moment at the time called:
            return moment();
        }
        get nextTime() {
            return this.findNext();
        }
        get minAway() {
            return this.findMinAway();
        }
        /* Methods: ***********************************************************************/
        findNext() {
            //The initial time is parsed as a moment with the given time on today's date:
            //For *some reason* moment.js uses 0-indexed months with its getter, so add 1 to the month:
            let next = moment(`${this.start}-${this.now.date()}-${this.now.month() + 1}-${this.now.year()}`,
                ['kk:mm-DD-MM-YYYY', 'kk:mm-DD-M-YYYY', 'kk:mm-D-MM-YYYY', 'kk:mm-D-M-YYYY'], true);
            //Increment Train.next by the frequency in minutes:
            while (next.isBefore(this.now, 'minute')) {
                next.add(this.frequency, 'm');
            }
            return next;
        }
        //Train.minAway is the difference between Train.next and Train.now in minutes:
        findMinAway() {
            return moment.duration(this.nextTime.diff(this.now, 'minutes'), 'minutes').asMinutes();
        }
        //Train.makeRow returns a table row with the necessary train data:
        makeRow() {
            let newRow = $('<tr>');
            newRow.append($('<td>').text(this.name));
            newRow.append($('<td>').text(this.destination));
            newRow.append($('<td>').text(this.frequency));
            newRow.append($('<td>').text(this.nextTime.format('h:mm A')));
            newRow.append($('<td>').text(this.minAway));
            newRow.append($('<td>').append($('<button>').attr({
                'class': 'update btn btn-primary',
                'data-train-name': this.name
            }).append($('<span>').addClass('oi oi-pencil'))));
            newRow.append($('<td>').append($('<button>').attr({
                'class': 'remove btn btn-primary',
                'data-train-name': this.name
            }).append($('<span>').addClass('oi oi-x'))));
            return newRow;
        }
        //Train.addToAllTrains adds the current train to the allTrains array and updates local storage:
        addToAllTrains() {
            allTrains = [...allTrains, this];
            localStorage.setItem('storedTrains', JSON.stringify(allTrains));
        }
        //Train.addToAllTrains removes the current train to the allTrains array and updates local storage:
        removeFromAllTrains() {
            allTrains = allTrains.filter(train => train.name !== this.name);
            localStorage.setItem('storedTrains', JSON.stringify(allTrains));
        }

    }

    //Get the array of table rows representing each train. If it doesn't yet exist, set an empty array:
    let storedTrains = JSON.parse(localStorage.getItem('storedTrains')) || [];

    //Disable the clear button if the table is empty:
    if (storedTrains.length === 0) $('#clear').attr('disabled', true);

    //Generate the allTrains array by forming new Trains from data retreived from local storage:
    let allTrains = storedTrains.map(train => new Train(train.name, train.destination, train.start, train.frequency));

    //Add a new row to the train scheduling table:
    allTrains.forEach(train => $('table').append(train.makeRow()));

    //On submiting a new form::
    $('#train-form').submit(e => {
        //Prevent reload:
        e.preventDefault();
        //Any changes from the edit button are reset:
        $('#time-label').text('First Train Time');
        $('#frequency').attr('readonly', false);
        //Construct a new train from the form fields:
        let newTrain = new Train(
            $('#train-name').val().trim(),
            $('#destination').val().trim(),
            $('#first-time').val().trim(),
            $('#frequency').val().trim()
        );
        //Look for duplicates:
        let duplicates = 0;
        for (let train of allTrains) {
            //If an existing train takes the form '${newTrain.name}' or '${newTrain.name} (2)', et c, it counts as a duplicate:
            const re = new RegExp(`^${train.name.split(/ \(\d\)/)[0]}$|${train.name.split(/ \(\d\)/)[0]} \(\d\)`, 'g');
            if (re.test(newTrain.name.split(/ \(\d\)/)[0])) {
                duplicates++;
            }
        }
        //If no duplicate exists, keep the name, else add a (2), (3) et c.:
        newTrain.name = (duplicates === 0) ? newTrain.name : `${newTrain.name} (${duplicates + 1})`;
        //Make sure the clear button is available:
        $('#clear').attr('disabled', false);
        //Add the new Train:
        newTrain.addToAllTrains();
        //...and appended to the table body:
        $('#train-schedule').append(newTrain.makeRow());
    });

    //The Clear button removes trains from localStorage, resets allTrains, and clears the table body:
    $('#clear').on('click', () => {
        localStorage.clear();
        allTrains = [], storedTrains = [];
        $('#clear').attr('disabled', true);
        $('#train-schedule').empty();
    });

    //The Remove button removes an individual train from both the table and allTrains:
    $('table').on('click', '.remove', function () {
        //The train who's name matches this buttons data-train-name is removed:
        const thisTrain = allTrains.filter(train => train.name === $(this).attr('data-train-name'))[0];
        thisTrain.removeFromAllTrains();
        //The parent <tr> element is deleted:
        $(this).closest('tr').remove();
    });

    $('table').on('click', '.update', function () {
        //The current train is pulled from allTrains:
        const thisTrain = allTrains.filter(train => train.name === $(this).attr('data-train-name'))[0];
        //And removed from allTrains:
        thisTrain.removeFromAllTrains();
        $(this).closest('tr').remove();
        //Form values are set based on the train being edited:
        $('#train-name').val(thisTrain.name);
        $('#destination').val(thisTrain.destination);
        $('#time-label').text('Next Arrival');
        $('#first-time').val(thisTrain.nextTime.format('kk:mm'));
        $('#frequency').val(thisTrain.frequency).attr('readonly', true);
        $('#train-form').attr('id', 'train-update-form');
    });
});
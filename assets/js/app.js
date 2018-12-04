$(document).ready(function () {

    //Get the array of table rows representing each train. If it doesn't yet exist, set an empty array:
    let storedTrains = JSON.parse(localStorage.getItem('storedTrains')) || [];

    //Disable the clear button if the table is empty:
    if (storedTrains.length === 0) $('#clear').attr('disabled', true);



    /*Construct the Train class: ***********************************************************/
    class Train {
        constructor(name, destination, start, frequency) {
            this.name = name;
            this.destination = destination;
            //The start time is parsed as a moment with the given time on today's date:
            //For *some reason* moment.js uses 0-indexed months, so add 1 to the month:
            this.start = start;
            this.frequency = frequency;
        }
        /* Getters: ************************************************************************/
        get now() {
            //Train.now is the current moment:
            return moment();
        }
        get nextTime() {
            return this.findNext();
        }
        get minAway() {
            return this.findMinAway();
        }
        /* Methods: ***********************************************************************/
        //Train.next is incremented by the frequency and returned when it's later than Train.now:
        findNext() {
            let next = moment(`${this.start}-${this.now.date()}-${this.now.month() + 1}-${this.now.year()}`,
            ['kk:mm-DD-MM-YYYY', 'kk:mm-DD-M-YYYY', 'kk:mm-D-MM-YYYY', 'kk:mm-D-M-YYYY'], true);
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
            return `<tr><td class="name-cell">${this.name}</td>
                <td class="dest-cell">${this.destination}</td>
                <td class="freq-cell">${this.frequency}</td>
                <td class="next-cell">${this.nextTime.format('h:mm A')}</td>
                <td class="min-away-cell">${this.minAway}</td>
                <td><button class="update btn btn-primary" data-train-name="${this.name}">
                    <span class="oi oi-pencil"></span>
                </button></td>
                <td><button class="remove btn btn-primary" data-train-name="${this.name}">
                    <span class="oi oi-x"></span>
                </button></td></tr>`;
        }
        addToAllTrains() {
            allTrains = [...allTrains, this];
            localStorage.setItem('storedTrains', JSON.stringify(allTrains));
        }
        removeFromAllTrains() {
            allTrains = allTrains.filter(train => train.name !== this.name);
            localStorage.setItem('storedTrains', JSON.stringify(allTrains));
        }

    }

    let allTrains = storedTrains.map(train => new Train(train.name, train.destination, train.start, train.frequency));
 

    allTrains.forEach(train => $('table').append(train.makeRow()));

    

    //On submiting the form:
    $('#train-form').submit(e => {
        
        e.preventDefault();

        //A new train is constructed from the form fields:
        let newTrain = new Train(
            $('#train-name').val().trim(),
            $('#destination').val().trim(),
            $('#first-time').val().trim(),
            $('#frequency').val().trim()
        );
        //Look for duplicates:
        let duplicates = 0;
        for (let train of allTrains) {
            const re = new RegExp(`^${train.name.split(/ \(\d\)/)[0]}$|${train.name.split(/ \(\d\)/)[0]} \(\d\)`, 'g');
            if (re.test(newTrain.name.split(/ \(\d\)/)[0])) {
                duplicates++;
            }
        }
        newTrain.name = (duplicates === 0) ? newTrain.name : `${newTrain.name} (${duplicates + 1})`;

        $('#clear').attr('disabled', false);
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
        $(this).closest('tr').remove();
    });

    $('table').on('click', '.update', function () {
        const thisTrain = allTrains.filter(train => train.name === $(this).attr('data-train-name'))[0];
        thisTrain.removeFromAllTrains();
        $('#train-name').val(thisTrain.name);
        $('#destination').val(thisTrain.destination);
        $('#first-time strong').text('Next Arrival');
        $('#first-time').val(thisTrain.nextTime.format('kk:mm'));
        $('#frequency').val(thisTrain.frequency).attr('readonly', true);
        $(this).closest('tr').remove();
        $('#train-form').attr('id', 'train-update-form');
    });

});
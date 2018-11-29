$(document).ready(function () {

    //Get the array of table rows representing each train. If it doesn't yet exist, set an empty array:
    let allTrains = JSON.parse(localStorage.getItem('allTrains')) || [];
    //Disable the clear button if the table is empty:
    if (allTrains.length === 0) $('#clear').attr('disabled', true);
    //Append each existing table row to the table body:
    allTrains.forEach(train => $('#train-schedule').append(train.trainRow));

    

    /*Construct the Train class: ***********************************************************/
    class Train {
        constructor(name, destination, start, frequency) {
            this.name = name;
            this.destination = destination;
            //The start time is parsed as a moment with the given time on today's date:
            //For *some reason* moment.js uses 0-indexed months, so add 1 to the month:
            this.start = moment(`${start} ${this.now.date()} ${this.now.month() + 1} ${this.now.year()}`,
                'kk:mm DD MM YYYY', true);
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
            let next = this.start;
            while(next.isBefore(this.now, 'minute')) {
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
            return `<tr id="${this.name}-row"><td>${this.name}</td>
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
        
    }

    //On submiting the form:
    $('form').submit( e => { 
        e.preventDefault();
        //A new train is constructed from the form fields:
        let newTrain = new Train(
            $('#train-name').val().trim(),
            $('#destination').val().trim(),
            $('#first-time').val().trim(),
            $('#frequency').val().trim()
        );
        $('#clear').attr('disabled', false);
        //A train row based on the train's data is added to the allTrains array:
        allTrains = [...allTrains, {trainName: $('#train-name').val().trim(), trainRow: newTrain.makeRow()}];
        //The train is added to local storage:
        localStorage.setItem('allTrains', JSON.stringify(allTrains));
        //...and appended to the table body:
        $('#train-schedule').append(newTrain.makeRow());
        
    });

    //The Clear button removes trains from localStorage, resets allTrains, and clears the table body:
    $('#clear').on('click', () => {
        localStorage.clear();
        allTrains = [];
        $('#clear').attr('disabled', true);
        $('#train-schedule').empty();
    });

    //The Remove button removes an individual train from both the table and allTrains:
    $('table').on('click', '.remove', function() {
        //The train who's name matches this buttons data-train-name is removed:
        allTrains = allTrains.filter(train => train.trainName !== $(this).attr('data-train-name'));
        localStorage.setItem('allTrains', JSON.stringify(allTrains));
        $(`#${$(this).attr('data-train-name')}-row`).remove();
    });

    $('table').on('click', '.update', function () {
        
    });

});
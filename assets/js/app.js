$(document).ready(function () {

    let allTrains = (JSON.parse(localStorage.getItem('allTrains')) || []);
    let trainCount = (JSON.parse(localStorage.getItem('trainCount')) || 0);

    for(let train of allTrains) {
        console.log(train);
    }

    class Train {
        constructor(name, destination, start, frequency) {
            this.name = name;
            this.destination = destination;
            this.start = moment(`${start} ${this.now.date()} ${this.now.month() + 1} ${this.now.year()}`, 'kk:mm DD MM YYYY', true);
            this.frequency = frequency;
        }
        get now() {
            return moment();
        }
        get nextTime() {
            return this.findNext();
        }
        get minAway() {
            return this.findMinAway();
        }
        findNext() {
            let next = this.start;
            while(next.isBefore(this.now, 'minute')) {
                next.add(this.frequency, 'm');
            }
            return next;
        }
        findMinAway() {
            return moment.duration(this.nextTime.diff(this.now, 'minutes'), 'minutes').asMinutes();
        }
        makeRow() {
            return $('<tr>').html(
                `<td>${this.name}</td>
                <td>${this.destination}</td>
                <td>${this.frequency}</td>
                <td>${this.nextTime.format('h:mm A')}</td>
                <td>${this.minAway}</td>`);
        }
    }

    $('form').submit( function(e) { 
        e.preventDefault();
        let newTrain = new Train(
            $('#train-name').val().trim(),
            $('#destination').val().trim(),
            $('#first-time').val().trim(),
            $('#frequency').val().trim()
        );
        trainCount++;
        allTrains = [...allTrains, newTrain];
        localStorage.setItem('trainCount', JSON.stringify(trainCount));
        localStorage.setItem('allTrains', JSON.stringify(allTrains));
        $('table').append(newTrain.makeRow());
        
    });
});
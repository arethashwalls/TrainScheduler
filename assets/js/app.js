$(document).ready(function () {
    let allTrains = (localStorage.getItem('allTrains') || []);
    let trainCount = (localStorage.getItem('trainCount') || 0);

    function nextTime(starts, frequency) {
        const now = moment();
        let next = moment(`${starts} ${now.date()} ${now.month() + 1} ${now.year()}`, 'kk:mm DD MM YYYY', true);
        while(next.isBefore(now, 'minute')) {
            next.add(frequency, 'm');
        }
        return next;
    }
   
    function makeRow(name, destination, starts, frequency) {
        const nextArrival = nextTime(starts, frequency);
        return $('<tr>').html(
            `<td>${name}</td>
            <td>${destination}</td>
            <td>${frequency}</td>
            <td>${nextArrival.format('h:mm A')}</td>
            <td>${moment.duration(nextArrival.diff(moment(), 'minutes'), 'minutes').asMinutes()}</td>`);
    }

    // $('#submit').on('click', function(e) {
    $('form').submit( function(e) { 
        e.preventDefault();
        nextTime($('#first-time').val().trim(), $('#frequency').val().trim());
        $('table').append(
            makeRow($('#train-name').val(), $('#destination').val(), 
            $('#first-time').val(), $('#frequency').val())
        );
        
    });
});
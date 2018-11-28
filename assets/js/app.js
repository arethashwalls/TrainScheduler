$(document).ready(function () {
    let allTrains = (localStorage.getItem('allTrains') || []);
    let trainCount = (localStorage.getItem('trainCount') || 0);

    function nextTime(firstTime, frequency) {
        const now = moment();
        let next = moment(`${firstTime} ${now.date()} ${now.month() + 1} ${now.year()}`, 'kk:mm DD MM YYYY', true);
        while(next.isBefore(now, 'minute')) {
            next.add(frequency, 'm');
        }
        return next;
    }
   
    function makeRow(name, destination, starts, frequency) {
        return $('<tr>').html(`<td>${name}</td><td>${destination}</td><td>${frequency}<td>`);
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
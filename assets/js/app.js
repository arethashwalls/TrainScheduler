$(document).ready(function () {
    var allTrains = (localStorage.getItem('allTrains') || []);
    var trainCount = (localStorage.getItem('trainCount') || 0);

    function makeRow(name, destination, starts, frequency) {
        return $('<tr>').html(`<td>${name}</td><td>${destination}</td><td>${frequency}<td>`);
    }

    $('#submit').on('click', function(e) {
        e.preventDefault();
        $('table').append(
            makeRow($('#train-name').val(), $('#destination').val(), 
            $('#first-time').val(), $('#frequency').val())
        );
    });
});
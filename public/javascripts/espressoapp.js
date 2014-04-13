//this will house the javascript to bind them all
function submitClickHandler(event) {
  event.preventDefault();
  var today = new Date().toDateString();

  //each record should contain three pieces of information. 1. Amount 2. Category 3. Timestamp
  var record = {
    'amount' : $('#inputForm > input[name="amount"]').val(),
    'category' : $('#inputForm > select[name="category"]').val(),
    'timestamp' : today
  };

  $.ajax({
    type: 'POST',
    data: record,
    url: '/additem',
    dataType: 'JSON'
  })
    .done(function(response) {
      //empty string means success
      if(response.msg === '') {
        $('#debugout').text('Record has been saved.');
        //clear input
        $('#inputForm > input[name="amount"]').val('');
      } else {
        $('#debugout').text('Oops. Something happened: ' + response.msg);
      }
    });
}

$(document).ready(function() {
  //handle click or touch event on submit button
  $("#btnSubmit").on('click', submitClickHandler);
  $("#category").on('change', function() {
    $("#category").toggleClass('inactive');
    $("#category").off('change');
  });
});
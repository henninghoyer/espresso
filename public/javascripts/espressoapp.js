//this will house the javascript to bind them all
function submitClickHandler(event) {
  event.preventDefault();

  //each record should contain three pieces of information. 1. Amount 2. Category 3. Timestamp
  var record = {
    'amount' : $('#inputForm > input[name="amount"]').val(),
    'category' : $('#inputForm > select[name="category"]').val()
  };

  $.ajax({
    type: 'POST',
    data: record,
    url: '/additem',
    dataType: 'JSON',
    beforeSend: function() {
      $('#debugout .msg-save').toggle();
    }
  })
    .done(function(response) {
      //empty string means success
      if(response.msg === '') {
        $('#debugout .msg-save').toggle();
        $('#debugout .fa').toggle(600);
        $('#debugout .fa').toggle(2000);

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
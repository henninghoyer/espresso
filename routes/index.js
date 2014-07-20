/*
 * GET home page.
 */
// exports.index = function(req, res){
//   res.render('index', { title: 'Espresso - Chill your Finances' });
// };

exports.inputview = function(db) {
  return function(req, res){
    db.collection('categories').find().toArray(function (err, items) {
      res.render('index', {title: 'Espresso - Chill your Finances', 'clist': items });
    });
  };
};

exports.reportview = function(db) {
  // Return monthly spend data so far
  // so this is what we'll query the DB for at this point
  
  // this seems to work on the mongo commandline
  // db.expenses.find({added:{$gt: ISODate("2014-04-20T00:00:0.000Z"), $lt: ISODate("2014-04-22T00:00:00.000Z")}})
  // it doesn't from javascript though, as ISODate is just a mongodb wrapper for the JS Date object.

  // This does work. Finally... :)
  return function(req, res) {
    var td = new Date();
    var day = '01';
    var month = td.getMonth()+1;
    var year = td.getFullYear();

    if(month < 10) {
      month = '0' + month;
    }
    var startDate = year + '-' + month + '-' + day;

    // get total sum of all transactions in the month
    var monthlySums = db.collection('expenses').mapReduce(
      function() {
        emit(this.category, this.amount);
      },
      function(key, values) {
        return Array.sum(values);
      },
      {
        query:
        {
          added: {$gte: new Date(startDate)}
        },
        out: {inline: 1}
      },
      function(key, reducedVal) {
        //compute total sum of all transactions
        var ovrlSum = 0;

        for (var i = 0; i < reducedVal.length; i++) {
          ovrlSum += parseFloat(reducedVal[i].value,10);
        }

        //sort the array based on sum of the categories 
        reducedVal.sort(function(a, b) {
          return b.value - a.value;
        });

        ovrlSum = Math.ceil(ovrlSum * 100) / 100;

        //add an entry with the total spend to the start of the array
        reducedVal.unshift({'_id': 'Total Spend', 'value': ovrlSum}); //make sure the Total Spend comes first in the Array. Saves work later.

        //render view with the first four items of the array (total + top three)
        res.render('report', {'monthlySums': reducedVal.slice(0,4)});
        // res.render('report', {'monthlySums': reducedVal});
      }//finalize function
    );
  };//return function
};//reportview

exports.additem = function(db) {
  return function(req, res) {
    db.collection('expenses').insert({amount: parseFloat(req.body.amount), category: req.body.category, added: new Date()}, function(err, result) {
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  };
};
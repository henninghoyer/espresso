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

    var ary = db.collection('expenses').mapReduce(
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
        var ovrlSum = 0;

        for (var i = 0; i < reducedVal.length; i++) {
          ovrlSum += parseFloat(reducedVal[i].value,10);
        }
        reducedVal.push({'_id': 'Total', 'value': ovrlSum});

        res.render('report', {'monthlySums': reducedVal});
      }
    );//mapReduce
  };//return function
};//reportview

exports.additem = function(db) {
  return function(req, res) {
    db.collection('expenses').insert({amount: req.body.amount, category: req.body.category, added: new Date()}, function(err, result) {
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  };
};
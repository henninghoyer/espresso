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
  // We'll start by rendering the daily spend overview,
  // so this is what we'll query the DB for at this point
  // set hours ensures the time component is set to all
  // 0's so we're basically dealing with midnight.
  // var startDate, endDate;
  // startDate = new Date();
  // startDate.setHours(0,0,0,0);
  // endDate = new Date();
  // var day = startDate.getDate();
  // endDate.setDate(day+1);
  // endDate.setHours(0,0,0,0);
  var startDate = new Date(2014, 3, 21);
  var endDate = new Date(2014, 3, 22);


//   db.expenses.mapReduce( 
//   function(){emit(this._id, this.amount);}, 
//   function(key, values){return Array.sum(values);},
//   {
//     query:{ timestamp: {$gte: ISODate("2014-04-21T00:00:01Z"), $lt: ISODate("2014-04-22T00:00:00Z")}},
//     out:"expense_totals"
//   }
// );
  return function(req, res) {
    db.collection('expenses').find({timestamp: startDate}).toArray(function (err, items) {
      if(err) {
        console.log(err);
      } else {
        console.log(items);
      }
    });
    // db.collection('expenses').mapReduce(
    //   function() {
    //     emit(this._id, this.amount);
    //   },
    //   function(key, values) {
    //     return Array.sum(values);
    //   },
    //   {
    //     // query: { 'timestamp': {$gt: startDate, $lt: endDate}},
    //     query: { 'category': "groceries"},
    //     out: {inline: 1}
    //   },
    //   function(err, res, stats) {
    //     if(err) {
    //       console.log(err);
    //     } else {
    //       console.log("Result: " + res);
    //     }
    //     // res.render
    //   }
    // );
  };
};

exports.additem = function(db) {
  return function(req, res) {
    db.collection('expenses').insert({amount: req.body.amount, category: req.body.category, added: new Date()}, function(err, result) {
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  };
};
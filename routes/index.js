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
  
  // this seems to work on the mongo commandline
  // db.expenses.find({added:{$gt: ISODate("2014-04-20T00:00:0.000Z"), $lt: ISODate("2014-04-22T00:00:00.000Z")}})
  // it doesn't from javascript though, as ISODate is just a mongodb wrapper for the JS Date object.

  // This does work. Finally... :)
  return function(req, res) {
    var map = function() {
        emit( this.category, this.amount );
    };
    var reduce = function(key, values) {
        return Array.sum(values);
    };
 
    var expSum = db.collection('expenses').mapReduce(
      map,
      reduce,
      { query:
        {
          added: {$gte: new ISODate("2014-04-22")}
        },
        out: {inline: 1}
      });
    console.log(expSum);
    // db.collection('expenses').find({added:{$gt: new Date("2014-04-20T00:00:0.000Z"), $lt: new Date("2014-04-22T00:00:00.000Z")}}).toArray(function (err, items) {
      // if(err) {
        // console.log(err);
      // } else {
        // console.log(items);
        // res.render('report', {title: 'Espresso - Chill your Finances'});
      // }
    // });

    // And this will return aggregated spend for a given day per category
    // given the volume of data it really wouldn't make sense to pre-aggregate this on the server...
    // db.expenses.mapReduce( function() {emit( this.category, this.amount ); }, function(key, values) { return Array.sum(values) },  { query: { added: {$gte: new ISODate("2014-04-22")}}, out: {inline: 1}})


    //   db.expenses.mapReduce( 
//   function(){emit(this._id, this.amount);}, 
//   function(key, values){return Array.sum(values);},
//   {
//     query:{ timestamp: {$gte: ISODate("2014-04-21T00:00:01Z"), $lt: ISODate("2014-04-22T00:00:00Z")}},
//     out:"expense_totals"
//   }
// );

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
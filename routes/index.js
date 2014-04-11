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

exports.additem = function(db) {
  return function(req, res) {
    db.collection('expenses').insert(req.body, function(err, result) {
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  };
};
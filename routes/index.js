/*
 * GET home page.
 */
// exports.index = function(req, res){
//   res.render('index', { title: 'Espresso - Chill your Finances' });
// };

exports.additem = function(db) {
  return function(req, res){
    db.collection('categories').find().toArray(function (err, items) {
      res.render('additem', {title: 'Espresso - Chill your Finances', 'clist': items });
    });
  };
};

exports.saveitem = function(db) {
  return function(req, res) {
    db.collection('expenses').insert(req.body, function(err, result) {
      if( err === null ) {
        res.redirect('/', {'status': 'success'});
      } else {
        res.redirect('/', {'status': err});
      }
    });
  };
};
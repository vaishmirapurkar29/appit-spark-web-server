var mysql = require('mysql');
var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended: false});
var con = mysql.createConnection({
  host: "localhost",
  user: "team",
  password: "12App!tsparksql34",
  database: "appit_spark"
});
con.connect(function(err) {
  if (err) throw err;
  });
app.set('view engine','ejs');
app.get('/',function(req,res){
  res.render('index');
});
app.set('view engine','ejs');
app.get('/sign-up',function(req,res){
  res.render('sign-up');
});
app.get('/login',function(req,res){
  res.render('login',{qs: req.query})
});
app.get('/business',function(req,res){
  res.render('business',{qs: req.query})
});
app.post('/login',urlencodedParser,function(req,res){
  console.log(req.body);
  var pw=req.body.pw;
  var email=req.body.email;
  var sql='SELECT * FROM users WHERE email = ?';
  con.query(sql,[email], function (err, result, fields) {
    if (result) {
      if (result.length==0){
        console.log(result.length);
        res.writeHead(200, {'Content-Type': 'application/json'});
        var myobj3={status:'FALSE'};
        res.end(JSON.stringify(myobj3));
        //res.render('login-noemail');
      }
      else
      {
        console.log(result.length);
        var check=result[0].password;
        console.log(pw);
        if(check===pw)
        {
            myobj_user=[];
            myobj_user.push({
              uname:result[0].username,
              dob:result[0].dob
              });
            var my_count;
            con.query("SELECT COUNT(*) AS namesCount FROM businesses", function (err, rows, fields) {
            if (err) throw err;
            my_count=rows[0].namesCount;
            });
            var myobj_business; var ar;
            con.query("SELECT * FROM businesses", function (err, result, fields) {
            if (err) throw err;
            myobj_business=[];
            for (i = 0; i < my_count; i++) {
              myobj_business.push({
                business_id:result[i].business_id,
                name:result[i].name,
                type:result[i].type
              });
              }
              res.writeHead(200, {'Content-Type': 'application/json'});
              var arr={'credentials':'TRUE','user':myobj_user,'business':myobj_business};
              res.end(JSON.stringify(arr));
              });
          //res.render('login-success',{data: req.body})
        }
        else {
          res.writeHead(200, {'Content-Type': 'application/json'});
          var myobj2={credentials:'FALSE'};
          console.log('No');
          console.log(check);
          res.end(JSON.stringify(myobj2));
          //res.render('login-noemail');
        }
      }
    }
  });
});
app.post('/business',urlencodedParser,function(req,res){
  console.log(req.body);
  var myobj_reviews=[];
  var business_id=req.body.business_id;
  var bid=business_id;
  var sql = 'SELECT * FROM businesses WHERE business_id = ?';
  con.query(sql, [bid], function (err, result) {
    if (err) throw err;
    var arr={business_id:result[0].business_id,
    name:result[0].name,
    address:result[0].address,
    type:result[0].type,
    phone:result[0].phone,
    open_hours:result[0].open_hours,
    number_of_reviews:result[0].number_of_reviews,
    average_rating:result[0].average_rating };
    var sql_rev = 'SELECT * FROM reviews WHERE business_id = ?';
    con.query(sql_rev, [bid], function (err_rev, result_rev) {
      if (err_rev) throw err_rev;
    myobj_reviews.push({
      review_id:result_rev[0].review_id,
      lighting:result_rev[0].lighting,
      audio:result_rev[0].audio,
      decoration:result_rev[0].decoration,
      staff:result_rev[0].staff,
      comment:result_rev[0].comment,
      average:result_rev[0].average,
      user_id:result_rev[0].user_id,
      business_id:result_rev[0].business_id
    });
    console.log(myobj_reviews);
    res.writeHead(200, {'Content-Type': 'application/json'});
      var bus_in={'business':arr,'reviews':myobj_reviews};
      res.end(JSON.stringify(bus_in));
  });

  });
});
app.listen(3000);

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
            //my_count=[];
            con.query("SELECT COUNT(*) AS namesCount FROM businesses", function (err, rows, fields) {
            if (err) throw err;
            //console.log(rows[0].namesCount);
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
                //address:result[i].address,
                type:result[i].type,
                //phone:result[i].phone,
                //open_hours:result[i].open_hours,
                //number_of_reviews:result[i].number_of_reviews,
                //average_rating:result[i].average_rating
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
          var myobj2={status:'FALSE'};
          console.log('No');
          console.log(check);
          res.end(JSON.stringify(myobj2));
          //res.render('login-noemail');
        }
      }
    }
  });
});
app.get('/profile/:name', function(req, res){
  res.render('profile');
});
app.listen(3000);

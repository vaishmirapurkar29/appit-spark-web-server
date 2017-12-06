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
  var pw=req.body.password;
  var email=req.body.email;
  var sql='SELECT * FROM users WHERE email = ?';
  con.query(sql,[email], function (err, result, fields) {
    if (result) {
      if (result.length==0){
        console.log('Wrong email')
        res.render('login-noemail');
      }
      else
      {
        var check=[];
        check=result[0].pass;
        if(check===pw)
        {
          console.log(result);
          res.render('login-success',{data: req.body})
          var myobj={
            uid: result[0].userid,
            uname:result[0].uname,
            dob:result[0].dob ,
            pw: result[0].pass,
            email:result[0].email
          };
          res.end(JSON.stringify(myobj));
          console.log(myobj)
        }
        else {
          console.log('No');
          console.log(check);
          res.render('login-noemail');
        }
      }
    }
  });
});
app.get('/profile/:name', function(req, res){
  res.render('profile');
});

app.listen(3000);

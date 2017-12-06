var express=require('express');
var app=express();

app.get('/',function(req,res){
  res.send('Homepage');
});
app.get('/contact',function(req,res){
  res.send('Contact Page');
});
app.listen(3000);

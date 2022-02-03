const mysql = require('mysql');
const Sequelize = require('sequelize');
const express = require("express");
const app = express();
var cors = require('cors');
app.use(cors());
const paginate = require('jw-paginate');
const connection = new Sequelize('nodemysql', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});
const Transaction = connection.define("transaction", {
  amount: {
    type: Sequelize.DECIMAL,
    allowNull: false,
},
total_amount: {
  type: Sequelize.DECIMAL,
  allowNull: false,
},
transaction_type: {
  type: Sequelize.ENUM('Credit', 'Debit'),
  defaultValue: 'Credit',
},
description:{
  type:Sequelize.STRING,
  default:null
},deleted: {
  type: Sequelize.INTEGER(1),
  defaultValue: 0
}
},
{
  defaultScope: {
    where: {
      deleted: 0
    }
  }
});
connection.sync();
app.use(express.json())
/*const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});*/
app.get("/listTranscation/:page/:limit",(req,res) => {
  var page = req.params.page;
  let limit = parseInt(req.params.limit);
  let offset = 0 + (req.params.page - 1) * limit;
  Transaction.findAndCountAll({
    offset: offset,
        limit: limit,
    order: [ [ 'createdAt', 'DESC' ]]
  }).then(function (article) {
   const pager = paginate(article.count, page, limit);
    res.send({article,pager});
});
    //connection.query('SELECT * from transaction LIMIT 1', (err, rows) => {
        //if(err) throw err;
      //  res.send(rows);
       // console.log('The data from transaction table ares: \n', rows);
        //connection.end();
    //});
});
app.get('/getTransaction/:id',(req,res) => {
  Transaction.findByPk(req.params.id)
  .then(function(entity){
    res.send(entity);
  });
});
app.get('/deleteTransaction/:id',(req,res) => {
  Transaction.update(
      {deleted: 1},
      {where: {id:req.params.id}}
    )
    .then(() => {
        data = {
          'status': 'success',
          'results': ''
        };
        res.send(data);
      });
  });
app.post('/updateTransaction/:id',(req,res) => {
    let reqGet = req.body;
    var validateRes = validateTransaction(reqGet);
    if(validateRes.status == 'exist')
    {
        data = {
          'status' : 'error',
          'results' : validateRes.results
        }
        res.send(data);
    }
    else{
      Transaction.update(
        {description: reqGet.description},
        {where: {id:req.params.id}}
      )
      .then(() => {
        data = {
          'status' : 'success',
          'results' : ''
        }
        res.send(data);
      });
    }
});
app.post("/create",(req,res) => {
  let data = errorShow = {};
  let reqGet = req.body;
  var validateRes = validateTransaction(reqGet);
  if(validateRes.status == 'exist')
  {
      data = {
        'status' : 'error',
        'results' : validateRes.results
      }
      res.send(data);
  }
    else{

          Transaction.findAndCountAll({
            limit: 1,
            order: [ [ 'createdAt', 'DESC' ]]
          }).then(function(entries){
           // console.log(entries);
           // console.log(entries.rows[0].total_amount);
            //console.log(entries[0].total_amount);
           // return false;
            let NewAmount = prevAmount = 0;
              if(entries.count > 0)
              {
                prevAmount = entries.rows[0].total_amount;
              }
              else{
                prevAmount = 0;
              }
              
              if(reqGet.transaction_type == 'Credit')
              {
                NewAmount = +prevAmount + +reqGet.amount;
              }
              else
              {
                if(reqGet.amount > prevAmount)
                {
                  errorShow['amount'] = 'Your account does not have '+ reqGet.amount+'Rs';
                  data = {
                    'status' : 'error',
                    'results' : errorShow
                  }
                  res.send(data);
                  return false;
                }
                else{
                  NewAmount = +prevAmount - +reqGet.amount;
                }
              }
                //console.log(prevAmount+' '+NewAmount);
               // return false;
                Transaction.create({
                  amount: reqGet.amount,
                  total_amount: NewAmount,
                  transaction_type : reqGet.transaction_type,
                  description : reqGet.description
                  });
                  data = {
                    'status' : 'success',
                    'results' : ''
                  }
                  res.send(data);
          });
         
    }
    
});

app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
function validateTransaction(reqGet)
{
  var errorShow = {};
  var errorGot = '';
  if( typeof reqGet.amount === 'undefined' || reqGet.amount == null  || reqGet.amount == ''){
    errorShow['amount'] = 'Amount is required';
    errorGot = 'exist';
  }
  if( typeof reqGet.transaction_type === 'undefined' || reqGet.transaction_type == null  || reqGet.transaction_type == ''){
    errorShow['transaction_type'] = 'Transaction Type is required';
    errorGot = 'exist';
  }
  if( typeof reqGet.description === 'undefined' || reqGet.description == null  || reqGet.description == ''){
    errorShow['description'] = 'Description is required';
    errorGot = 'exist';
  }
  return {
    'status' : errorGot,
    'results' : errorShow
  }
}
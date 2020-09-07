const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var cors = require('cors');

const bcrypt = require('bcrypt');


var nodemailer = require('nodemailer');
var https   = require("https");
var fs      = require("fs");

var app = express();
//Configuring express server
app.use(bodyparser.json());

var mysqlConnection = mysql.createPool({
    host: 'db4free.net',
    user: 'mycms123',
    password: 'Welcome@0',
    database: 'mycms123',
    port : '3306',
    connectionLimit : 1,
    waitForConnections : true,
    queueLimit :0,
    multipleStatements: true,
    wait_timeout : 28800,
    connect_timeout :10
  });


// Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.get('/create-payment-intent/:id', (req, res) => {
    const { id } = ctx.params;
      console.log(id);
      var orderId='';
      var customerName='';
      var customerid='';
      var paymentDate ='';
      var paymentAmt = '';
      var paymentTrx = '';
      
    mysqlConnection.query('SELECT * FROM `carts` WHERE id = ' +id , (err, rows, fields) => {
      if (!err){
        var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
        orderId = resultArray[0].orderid;
        paymentDate = new Date(resultArray[0].paymentdate).toISOString().slice(0,10);
        paymentAmt = resultArray[0].amount;
        paymentTrx = resultArray[0].paymentremark;
        customerid = 'AG'+resultArray[0].agency;
      
        mysqlConnection.query('SELECT * FROM jobposts WHERE id IN ( SELECT jobpost_id FROM carts__jobposts WHERE cart_id = '+id+')' , (err, rows, fields) => {
          if (!err){
            var resultArrayjobpost = Object.values(JSON.parse(JSON.stringify(rows)));
            var productItem = [];
           customerName = resultArrayjobpost[0].advertiser_display_name;
            for(var jp=0; jp<resultArrayjobpost.length;jp++){
              var postprice = resultArrayjobpost[jp].price/resultArrayjobpost[jp].postcount;
          var item = {'name':resultArrayjobpost[jp].influencer_display_name+' Post','description':resultArrayjobpost[jp].platform+' Post','quantity':resultArrayjobpost[jp].postcount,'unit_cost':postprice};
         productItem.push(item);
        }

      var invoice = {
        logo: "http://app.cinfluencers.com/appresources/logo-cinfluencer.png",
        from: "Billing Organization\n All Things Digital Pte. Ltd. \n10 Anson Road, 10-11 \n Singapore 079903",
        to: customerName,
        currency: "usd",
        header: "Invoice",
        balance_title : "Amount",
        number: orderId,
        date : paymentDate,
        payment_terms_title : 'Payment Mode',
        payment_terms: "STRIPE "+paymentTrx,
        item_header : 'Particulars',
        items: productItem,
        fields: {
            tax: "%"
        },
        tax: 0,
        notes: "Thank you for your business. In case of any concerns, please write to us at info@cinfluencers.com."
    };
    var invoiceFileName = (customerid+"-"+Math.random().toString(36).substr(2, 10)).toUpperCase()+'.pdf';
    generateInvoice(invoice, invoiceFileName, function () {
        console.log("Saved invoice to invoice.pdf");
        var sql = "UPDATE `carts` SET invoice_path = '"+ invoiceFileName+"' WHERE id = " +id;
      mysqlConnection.query(sql, function (err, result) {
        if (err) throw err;
      }, function (error) {
        console.error(error);
      })
      }, function (error) {
        console.error(error);
      });

      function generateInvoice(invoice, filename, success, error) {
        var postData = JSON.stringify(invoice);
        var options = {
            hostname  : "invoice-generator.com",
            port      : 443,
            path      : "/",
            method    : "POST",
            headers   : {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        };
    
        var file = fs.createWriteStream('/var/www/html/invoices/'+filename);
    
        var req = https.request(options, function(res) {
            res.on('data', function(chunk) {
                file.write(chunk);
            })
            .on('end', function() {
                file.end();
    
                if (typeof success === 'function') {
                    success();
                }
            });
        });
        req.write(postData);
        req.end();
    
        if (typeof error === 'function') {
            req.on('error', error);
        }
    }
  }else
  console.log(err);
}) 
  }else
  console.log(err);
})
    ctx.send('invoice created');
});


//Router to INSERT/POST a learner's detail
app.post('/create-payment-intent',  async(req, res) => {
    const stripe = require("stripe")("sk_test_XXXp3lxbmV3Tg4WpvMV7mwkdO9CXXX");
  const { source, type, options, data } = ctx.request.body;
 
    console.log(ctx.request.body);

    console.log(ctx.request.body.amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ctx.request.body.amount,
      currency: ctx.request.body.currency,
      description: ctx.request.body.description
    });
    var customer = await stripe.customers.create({
        name: ctx.request.body.name,
        address: {
          line1: ctx.request.body.adline1,
          postal_code: ctx.request.body.adpostal_code,
          city: ctx.request.body.adcity,
          state: ctx.request.body.adstate,
          country: ctx.request.body.adcountry,
        }
    });
    ctx.response.send({
        clientSecret: paymentIntent.client_secret
      });
    });

    app.put('/create-payment-intent', (req, res) => {
        var sendgingMail = 'info@cinfluencers.com';
        var sendingPwd = 'Cinfluencers123!@#';
      
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: sendgingMail,
            pass: sendingPwd
          }
        });
     
        var dynamicInput = "'"+req.body._email+"'";
        var  found = false;
        var myPlaintextPassword = Math.random().toString(36).substr(2, 8);
        const saltRounds = 10;
          const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
         mysqlConnection.query('SELECT * FROM `users-permissions_user` WHERE username = ' +dynamicInput +' limit 1', (err, rows, fields) => {
          if (!err){
         var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
         var name = resultArray[0].Name;
         var _email = resultArray[0].email;
         found = true;
         if(_email === req.body._email && null != name) {
          console.log('update started');
            var sql = "UPDATE `users-permissions_user` SET password = '"+ hash+"' WHERE username = "+dynamicInput;
            mysqlConnection.query(sql, function (err, result) {
              if (err) {console.log(err)};
         
              var emailTemplate = `<table style="border:1px solid #dddddd;background-color:#ffffff" width="600" border="0" cellpadding="0" align="center" cellspacing="0">
              <tbody>
                <tr>
                   <td colspan="2" style="padding:30px 30px 0 30px;font-family:Arial;color:#444444;font-size:14px;line-height:1.5em" valign="top" align="left">
                        <div style="font-size:14px;line-height:1.6em;color:#444444">Hi ` +name+`,
                             <p>We have just received a forget password request from `+_email+`</p>
                             <p>Your New Password is <b>`+myPlaintextPassword+`</b></p>
                             <p></p>
                             <p>Please login now by clicking the button below</span></p>
                             <p style="text-align:center">
                                    <a href="https://app.cinfluencers.com/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://app.cinfluencers.com/&amp;source=gmail&amp;ust=1597161382807000&amp;usg=AFQjCNF25Y-sDrl7Za6FikTCU7JSTCH0gw"><span style="font-size:16px;min-width:200px;background-color:#c64752;line-height:42px;display:inline-block;color:white;border-radius:4px;text-align:center;margin-top:10px;padding:0 8px">Visit Cinfluencer »</span></a>
                             </p>
                             <p>Cheers,<br>Team CINFLUENCERS<br><br></p>
                             <p></p>
                             <div style="font-size:12px;color:#808080">If you did not sign up or request for password, please ignore this email.
                             </div>
                             <p></p>
                        </div>
                    </td>
                 </tr>
               </tbody>
            </table>`;
             
              var mailOptions = {
                from: sendgingMail,
                to: _email,
                subject: 'Cinflunecer Forget Password Request!',
                html: emailTemplate
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            });
          
          }
      
        }
          else
           console.log(err);
      })
      if(found) res.send('FOUND'); else res.send('NOT_FOUND');
        });   

  
      app.use(cors())  
    app.post("/activatereq", async (req, res) => {
        var sendgingMail = 'info@cinfluencers.com';
        var sendingPwd = 'Cinfluencers123!@#';
      
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: sendgingMail,
            pass: sendingPwd
          }
        });
      
        var dynamicInput = "'"+req.body._email+"'";
        var  found = false;
        var myPlaintextPassword = Math.random().toString(36).substr(2, 6);
        const saltRounds = 10;
          const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
         mysqlConnection.query('SELECT * FROM `users-permissions_user` WHERE username = ' +dynamicInput +' limit 1', (err, rows, fields) => {
          if (!err){
         var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
         var name = resultArray[0].Name;
         var _email = resultArray[0].email;
         var userId = resultArray[0].id;
         found = true;
         if(_email === req.body._email && null != name) {
          var emailTemplate = `<table style="border:1px solid #dddddd;background-color:#ffffff" width="600" border="0" cellpadding="0" align="center" cellspacing="0">
              <tbody>
                <tr>
                   <td colspan="2" style="padding:30px 30px 0 30px;font-family:Arial;color:#444444;font-size:14px;line-height:1.5em" valign="top" align="left">
                        <div style="font-size:14px;line-height:1.6em;color:#444444">Hi ` +name+`,
                             <p>Thank you for registering with CINFLUENCERS.</p>
                             <p></p>
                             <p>To activate your account, please click on the Link below</p>
                             <p style="text-align:center">
                                    <a href="https://app.cinfluencers.com/activatereq/`+userId+"/"+myPlaintextPassword+ `" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://app.cinfluencers.com/&amp;source=gmail&amp;ust=1597161382807000&amp;usg=AFQjCNF25Y-sDrl7Za6FikTCU7JSTCH0gw"><span style="font-size:16px;min-width:200px;background-color:#008000;line-height:42px;display:inline-block;color:white;border-radius:4px;text-align:center;margin-top:10px;padding:0 8px">Activate »</span></a>
                             </p>
                             <p>Cheers,<br>CINFLUENCERS Team<br><br></p>
                             <p></p>
                             <div style="font-size:12px;color:#808080">=======================
                             </div>
                             <p></p>
                        </div>
                    </td>
                 </tr>
               </tbody>
            </table>`;
             
              var mailOptions = {
                from: sendgingMail,
                to: _email,
                subject: 'Activate your account with CINFLUENCERS.',
                html: emailTemplate
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
    //              mysqlConnection.end();
                }
              });           
          }       
        }
          else
           console.log(err);
      })
        });

        app.get("/activatereq/:id/:pass", async (req, res) => {

            var confirmed = 1;
            const { id } = ctx.params;
        
                    var sql = "UPDATE `users-permissions_user` SET active = "+ confirmed +" WHERE id = "+id;
                    mysqlConnection.query(sql, function (err, result) {
                      if (err) {console.log(err)};
                    })
              //      mysqlConnection.end();
                    ctx.response.redirect('https://app.cinfluencers.com');
                  });            
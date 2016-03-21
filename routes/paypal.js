'use strict';

var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var config = require('../config.json')
const util = require('util');
// var nomo = require('node-monkey').start();
var session = require('express-session');

paypal.configure(config.api)

// Routes
router.get('/create', function(req, res, next){
  console.log('hitting the route');
  var method = req.param('method');
  var payment = {
    "intent": "sale",
    "payer": {
    },
    "transactions": [{
      "amount": {
        "currency": req.param('currency'),
        "total": req.param('amount')
      },
      "description": req.param('description')
    }]
  };

  if (method === 'paypal') {
    payment.payer.payment_method = 'paypal';
    payment.redirect_urls = {
      "return_url": "http://localhost:8080/paypal",
      "cancel_url": "http://localhost:8080/paypal"
    };
  } else if (method === 'credit_card') {
    var funding_instruments = [
      {
        "credit_card": {
          "type": req.param('type').toLowerCase(),
          "number": req.param('number'),
          "expire_month": req.param('expire_month'),
          "expire_year": req.param('expire_year'),
          "first_name": req.param('first_name'),
          "last_name": req.param('last_name')
        }
      }
    ];
    payment.payer.payment_method = 'credit_card';
    payment.payer.funding_instruments = funding_instruments;
  }
  console.log(payment);
  paypal.payment.create(payment, function (error, payment) {
    if (error) {
      console.log(error);
      res.json({error: error});
    } else {
      req.session.paymentId = payment.id;
      console.log("HERES THE PAYMENT OBJECT", payment);
      res.render('success', {'payment': payment});
      // res.json({payment: payment})
    }
  });
})

router.get('/execute', function(req, res, next){
  var paymentId = req.session.paymentId;
  var payerId = req.param('PayerID');
  var details = { "payer_id": payerId };
  var payment = paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      console.log(error);
      res.render('error', { 'error': error });
    } else {
      res.render('execute', { 'payment': payment });
    }
  });
})

module.exports = router;

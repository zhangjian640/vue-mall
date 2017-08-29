var express = require('express');
var router = express.Router();

const mongoose = require('mongoose')
let Goods = require('../models/goods')
let User = require('../models/user')


/* GET users listing. */
router.get('/', (req, res, next) => {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let priceLevel = req.param('priceLevel')
  let priceGt = ''
  let priceLte = ''
  let params = {}
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel
    .sort({'salePrice': sort})
    .exec((err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: {
            count: doc.length,
            list: doc
          }
        })
      }
    })
});

// 加入购物车
router.post('/addCart', (req, res, next) => {
  const userId = '100000077'
  const productId = req.body.productId
  User.findOne({
    userId: userId
  }, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (userDoc) {
        let goodsItem = ''
        userDoc.cartList.forEach((item) => {
          if (item.productId === productId) {
            goodsItem = item
            item.productNum++
          }
        })
        if (goodsItem) {
          userDoc.save((err2, doc) => {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          Goods.findOne({
            productId: productId
          }, (err1, goodsDoc) => {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message
              })
            } else {
              if (goodsDoc) {
                goodsDoc.productNum = 1
                goodsDoc.checked = 1
                userDoc.cartList.push(goodsDoc)
                userDoc.save((err2, doc) => {
                  if (err2) {
                    res.json({
                      status: '1',
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })

})

module.exports = router;

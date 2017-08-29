var express = require('express');
var router = express.Router();

const mongoose = require('mongoose')
let User = require('../models/user')
require('./../util/util')

/* GET users listing. */
router.get('/', function (req, res, next) {

});

// 检查登录
router.get("/checkLogin", function (req, res, next) {

  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

// 登录接口
router.post('/login', (req, res, next) => {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        // req.session.user = doc
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
});

// 登出
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

//查询购物车数量
router.get('/getCartCount', (req, res, next) => {
  const userId = req.cookies.userId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        let cartList = doc.cartList
        let cartCount = 0
        cartList.map((item)=>{
          cartCount += parseInt(item.productNum)
        })
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        })
      }
    }
  })
})

// 购物车列表
router.get('/cartList', (req, res, next) => {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})

// 购物车删除
router.post('/cartDel', (req, res, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  User.update({'userId': userId}, {$pull: {'cartList': {'productId': productId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 修改商品数量
router.post('/cartEdit', (req, res, next) => {
  const userId = req.cookies.userId
  const productId = req.body.productId
  const productNum = req.body.productNum
  const checked = req.body.checked

  User.update({'userId': userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 地址列表
router.get('/addressList', (req, res, next) => {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.addressList
        })
      }
    }
  })
})

// 设置默认地址
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId

  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'address is null',
      result: ''
    })
  }
  User.findOne({'userId': userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      var addressList = doc.addressList;
      addressList.forEach((item) => {
        if (item.addressId === addressId) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          })
        }
      })
    }
  })
})

// 删除地址
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  User.update({'userId': userId}, {$pull: {'addressList': {'addressId': addressId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 生成订单
router.post('/payMent', (req, res, next) => {
  let userId = req.cookies.userId
  let orderTotal = req.body.orderTotal
  let addressId = req.body.addressId
  User.findOne({'userId': userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      // 获取当前用户的地址
      let address = '', goodsList = []
      doc.addressList.forEach((item) => {
        console.log(item)
        console.log('addressId', addressId)

        if (addressId === item.addressId) {
          console.log(item)
          address = item
        }
      })
      // 获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if (item.checked === '1') {
          goodsList.push(item)
        }
      })

      const platform = '640'
      const r1 = Math.floor(Math.random() * 10)
      const r2 = Math.floor(Math.random() * 10)

      let sysDate = new Date().Format('yyyyMMddhhmmss')
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      let orderId = platform + r1 + sysDate + r2

      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }
      doc.orderList.push(order)
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})

// 根据订单Id查询订单信息
router.get('/orderDetail', (req, res, next) => {
  var userId = req.cookies.userId, orderId = req.param('orderId')
  User.findOne({userId: userId}, (err, userInfo) => {
    if (err) {
      res.json({
        status: '1',
        msg: err1.message,
        result: ''
      })
    } else {
      var orderList = userInfo.orderList
      if (orderList.length > 0) {
        let orderTotal = 0
        orderList.forEach((item) => {
          if (item.orderId === orderId) {
            console.log(item.orderTotal)
            orderTotal = item.orderTotal
          }
        })
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            status: '120002',
            msg: '无此订单',
            result: ''
          })
        }

      } else {
        res.json({
          status: '120001',
          msg: '当前用户未创建订单',
          result: ''
        })
      }
    }
  })
})
module.exports = router;

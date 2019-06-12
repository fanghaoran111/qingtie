// pages/home/per/per.js
var common = require('../../../common.js');
const app = getApp();
var today = common.getToday();
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date:today,
    address:"",
    src:"",
    ne:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function (options) {
    /*判断是第一次加载还是从position页面返回
    如果从position页面返回，会传递用户选择的地点*/
    if (options.address != null && options.address != '') {
      //设置变量 address 的值
      this.setData({
        address: options.address
      });
    } else {
      // 实例化地图API核心类
      qqmapsdk = new QQMapWX({
        //此key需要用户自己申请
        key: 'TZPBZ-W2T3X-EJ34E-7DQPM-W5A52-JCFBN'
      });
      var that = this;
      // 调用腾讯地图接口
      qqmapsdk.reverseGeocoder({
        success: function (res) {
          that.setData({
            address: res.result.address
          });
        },
        fail: function (res) {
          // console.log("调起失败")
        },
        complete: function (res) {
          //console.log(res);
        }
      })
    };
    // 数据库操作
    var _this = this;
    //1、引用数据库   
    const db = wx.cloud.database()
    //2、开始查询数据了  user对应的是集合的名称   
    db.collection('user').where({
       _openid:_this.data.openid
      }).orderBy('_id','desc').get({
      //如果查询成功的话    
      success: res => {
        console.log(res.data)
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值      
        this.setData({
          ne: res.data
        })
      }
    });
    // 获取openid
    wx.login({
      success: function (res) {    //请求自己后台获取用户openid
        wx.request({
          url: 'https://30paotui.com/user/wechat',
          data: {
            appid: 'wx4f94d2460072f16a',
            secret: 'e4fb468bce13d3791d1ecc7e7c461033', //小程序密钥
            code: res.code
          }, success: function (response) {
            var openid = response.data.openid;
            console.log('获取到的openid:' + openid);      //可以把openid存到本地，方便以后调用
            wx.setStorageSync('openid', openid);
          }
        })
      }
    })
  },
  // 地图跳转获取的方法
  onChangeAddress: function (e) {
    wx.navigateTo({
      url: "/pages/home/per/map/map"
    });
  },
  // "返回"图片的方法
  Onnav:function() {
    wx.switchTab({
      url: "/pages/home/home"
    });
  },
//  添加数据到云数据库
  res: function (e) {
    const db = wx.cloud.database()
    db.collection('user').add({
      data: {
        // 获取页面内需要上传的数据的value值
        username: e.detail.value.username,
        phone: e.detail.value.phone,
        name1: e.detail.value.name1,
        date: e.detail.value.date,
        add: e.detail.value.add
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          // 返回页面内需要上传的数据进行存储
          username: e.detail.value.username,
          phone: e.detail.value.phone,
          name1: e.detail.value.name1,
          date: e.detail.value.date,
          add: e.detail.value.add
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    

  }, 
  


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: "请柬信息"
    })
  }
})
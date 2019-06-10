const app = getApp()
Page({
  data: {
    scrollindex: 0,  //当前页面的索引值
    totalnum: 4,  //总共页面数
    starty: 0,  //开始的位置x
    endy: 0, //结束的位置y
    critical: 1, //触发翻页的临界值
    margintop: 0,  //滑动下拉距离
    ne:[],
    bigImg: 'https://fanghaoran.xyz/images/sek.jpg',//默认图片，设置为空也可以
    uImg: 'https://fanghaoran.xyz/images/sek.jpg',
    aImg: 'https://fanghaoran.xyz/images/sek.jpg',
    bImg: 'https://fanghaoran.xyz/images/sek.jpg',
    cImg: 'https://fanghaoran.xyz/images/sek.jpg',
    dImg: 'https://fanghaoran.xyz/images/sek.jpg',
  },
  onLoad: function () {
    var _this = this;
    // const _ =  db.command
    //1、引用数据库   
    const db = wx.cloud.database()
    //2、开始查询数据了  user对应的是集合的名称   
    db.collection('user').where({
      _openid: this.openid

    }).orderBy('_id', 'desc').get({

      //如果查询成功的话    
      success: res => {
        console.log(res.data)
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值      
        this.setData({
          ne: res.data
        })
      }
    });
    
  },
  /**
   * 用户分享自定义
   */
  onShareAppMessage: function (res) {
    return {
      title: '青春不老，我们不散',
      imageUrl:['bigImg','uImg','aImg','bImg','cImg','dImg']
    }
  },

  // 手指触摸
  scrollTouchstart: function (e) {
    let py = e.touches[0].pageY;
    this.setData({
      starty: py
    })
  },
  // 手指触摸后移动
  scrollTouchmove: function (e) {
    let py = e.touches[0].pageY;
    let d = this.data;
    this.setData({
      endy: py,
    })
    if (py - d.starty < 100 && py - d.starty > -100) {
      this.setData({
        margintop: py - d.starty
      })
    }
  },
  // 手指触摸动作结束
  scrollTouchend: function (e) {
    let d = this.data;
    if (d.endy - d.starty > 100 && d.scrollindex > 0) {
      this.setData({
        scrollindex: d.scrollindex - 1
      })
    } else if (d.endy - d.starty < -100 && d.scrollindex < this.data.totalnum - 1) {
      this.setData({
        scrollindex: d.scrollindex + 1
      })
    }
    this.setData({
      starty: 0,
      endy: 0,
      margintop: 0
    })
  },
 






  // 上传图片
  changeBigImg:function() {
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              bigImg: res.fileID,//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
            let fileID = res.fileID;
            //把图片存到img集合表
            const db = wx.cloud.database();
            db.collection("img").add({
              data: {
                bigImg: fileID
              },
              success: function () {
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'none',
                  duration: 3000
                })
              },
              fail: function () {
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            });
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },
  changeaImg:function() {
  let that = this;
  let openid = app.globalData.openid || wx.getStorageSync('openid');
  wx.chooseImage({
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      wx.showLoading({
        title: '上传中',
      });
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      let filePath = res.tempFilePaths[0];
      const name = Math.random() * 1000000;
      const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,//云存储图片名字
        filePath,//临时路径
        success: res => {
          console.log('[上传图片] 成功：', res)
          that.setData({
            aImg: res.fileID,//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
          });
          let fileID = res.fileID;
          //把图片存到img集合表
          const db = wx.cloud.database();
          db.collection("img").add({
            data: {
              aImg: fileID
            },
            success: function () {
              wx.showToast({
                title: '图片存储成功',
                'icon': 'none',
                duration: 3000
              })
            },
            fail: function () {
              wx.showToast({
                title: '图片存储失败',
                'icon': 'none',
                duration: 3000
              })
            }
          });
        },
        fail: e => {
          console.error('[上传图片] 失败：', e)
        },
        complete: () => {
          wx.hideLoading()
        }
      });
    }
  })
},
  changecImg: function () {
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              cImg: res.fileID,//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
            let fileID = res.fileID;
            //把图片存到img集合表
            const db = wx.cloud.database();
            db.collection("img").add({
              data: {
                cImg: fileID
              },
              success: function () {
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'none',
                  duration: 3000
                })
              },
              fail: function () {
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            });
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  }, 
  changebImg: function () {
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              bImg: res.fileID,//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
            let fileID = res.fileID;
            //把图片存到img集合表
            const db = wx.cloud.database();
            db.collection("img").add({
              data: {
                bImg: fileID
              },
              success: function () {
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'none',
                  duration: 3000
                })
              },
              fail: function () {
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            });
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },
  changedImg: function () {
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              dImg: res.fileID,//云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
            let fileID = res.fileID;
            //把图片存到img集合表
            const db = wx.cloud.database();
            db.collection("img").add({
              data: {
                dImg: fileID
              },
              success: function () {
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'none',
                  duration: 3000
                })
              },
              fail: function () {
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            });
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },
  // 顶部标题
  onShow: function () {
    wx.setNavigationBarTitle({
      title: "毕业季"
    })
  },
  
})

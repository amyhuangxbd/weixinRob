import {Wechaty, Room, Contact, log} from 'wechaty'
var requestAjax = require('request');
var loginUser
var count = 0
let timer
var loginAlias = ""
const SCKEY = "SCU7435T814fc97e82f86dc63549313b30fbe3b558edc2cebb6f1"

const bot = Wechaty.instance()

bot
.on('scan', (url, code)=>{
    if (!/201|200/.test(String(code))) {
        let loginUrl = url.replace(/\/qrcode\//, '/l/')
        require('qrcode-terminal').generate(loginUrl)
      }
      serverJiang(loginAlias+'scan','![logo]('+url+')')
      console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
})

.on('login', user=>{
    loginUser = user
    console.log(`${user.name()} login`)
    // log.info('Bot', 'user list: (%s)', JSON.stringify(user))
    /**
   * Main Contact Bot start from here
   */
    main()

})

.on('friend', async function (contact, request){
    if(request){
      await request.accept()
      //   const fileHelper = await Contact.load('filehelper')
      //   var formData
      // var loginUIN
          

      //     var list = contact
      //     var rawObject = list["rawObj"]
      //     formData = {}
      //     for (var key in rawObject) { 
      //       formData[key] = rawObject[key]
      //     }
      //     loginUIN = loginUser["obj"]

      //     formData["officeName"] = loginAlias || loginUIN["uin"]



      //     console.log('formData: ' + JSON.stringify(formData))
      //   requestAjax.post({url:'http://weixin.jdcf88.com/H5_server/api/Friend/SaveFriendData', json: true,
      //         headers: {
      //           "content-type": "application/json",
      //         },
      //         body: formData}, async function optionalCallback(err, httpResponse, body) {
      //         if (err) {
      //           return console.error('upload failed:', err);
      //         }
      //         console.log('Upload successful!  Server responded with:', body);

      //         if (body.success && Object.prototype.toString.call( body.data ) === '[object Object]') {

      //               var dataList = body.data
      //               let repeatContent = "Bot:  重复用户：\n" + "微信号：" + dataList["Alias"] + "\n 用户名：" + dataList["NickName"] + "\n 性别：" + (dataList["Sex"] !== '0' ? (dataList["Sex"] === '1' ? '男' : '女') : '') + "\n 省份：" + dataList["Province"] + "\n 城市：" + dataList["City"] + "\n 签名：" + dataList["Signature"]
      //               fileHelper.say(repeatContent)

      //               // await request.accept()
      //               setTimeout(async function(){
      //                 const remarkUser = '重复用户2 - ' + contact.get('name')
      //                 const ret = await contact.alias(remarkUser)
      //                 if (ret) {
      //                     console.log('ok')
      //                   } else {
      //                     console.error('failed')
      //                   }
      //                   await contact.refresh()
      //                   log.info('Bot', 'get alias: %s', contact.alias())
      //               }, 1000 * 30)

      //         } else if (body.success && body.data === 'insert success') {
      //             // await request.accept()
      //             setTimeout(async function(){
      //                 let oDate = new Date()
      //                 const nMonth = oDate.getMonth() + 1
      //                 const nDate = oDate.getDate()
      //                 const remarkName = contact.get('name') + nMonth + '.' + nDate
      //               const ret = await contact.alias(remarkName)
      //               if (ret) {
      //                   console.log('ok')
      //                 } else {
      //                   console.error('failed')
      //                 }
      //                 await contact.refresh()
      //                 log.info('Bot', 'get alias: %s', contact.alias())
      //               }, 1000 * 30)
                  
      //         }
      //       })
        console.log(`Contact: ${contact.name()} send request ${request.hello}`)
    }
})

.on('message', async function(m){
  Room
  const contact = m.from()
    const content = m.content()
    const room = m.room()
    if(m.self()||room){
      console.log(`Contact: ${contact.name()} Content: ${content}`);
       return;
    } else{
        console.log(`Contact: ${contact.name()} Content: ${content}`);
        if(/现在可以开始聊天了/.test(content)){
          const fileHelper = await Contact.load('filehelper')
          var formData
          var loginUIN
          

          var list = contact
          var rawObject = list["rawObj"]
          formData = {}
          for (var key in rawObject) { 
            formData[key] = rawObject[key]
          }
          loginUIN = loginUser["obj"]

          formData["officeName"] = loginAlias || loginUIN["uin"]



          console.log('formData: ' + JSON.stringify(formData))
          requestAjax.post({url:'http://weixin.jdcf88.com/H5_server/api/Friend/SaveFriendData', json: true,
              headers: {
                "content-type": "application/json",
              },
              body: formData}, async function optionalCallback(err, httpResponse, body) {
              if (err) {
                return console.error('upload failed:', err);
              }
              console.log('Upload successful!  Server responded with:', body);

              if (body.success && Object.prototype.toString.call( body.data ) === '[object Object]') {

                    var dataList = body.data
                    log.info('Bot', 'data list: (%s) \n', JSON.stringify(dataList))
                    let repeatContent = "Bot:  重复用户：\n" + "微信号：" + dataList["Alias"] + "\n 用户名：" + dataList["NickName"] + "\n 性别：" + (dataList["Sex"] !== '0' ? (dataList["Sex"] === '1' ? '男' : '女') : '') + "\n 省份：" + dataList["Province"] + "\n 城市：" + dataList["City"] + "\n 签名：" + dataList["Signature"] + "\n 重复微信号：" + dataList["officeName"]
                    fileHelper.say(repeatContent)

                    const remarkUser = '重复用户 - ' + contact.get('name')
                  const ret = await contact.alias(remarkUser)
                  if (ret) {
                      console.log('ok')
                    } else {
                      console.error('failed')
                    }
                    await contact.refresh()
                    log.info('Bot', 'get alias: %s', contact.alias())




                    let sendTextUrl = 'http://weixin.jdcf88.com/H5_server/api/Talk/GetTalk?officeName=' + loginAlias
                requestAjax.get({url:sendTextUrl}, async function optionalCallback(err, httpResponse, body) {
              if (err) {
                return console.error('upload failed:', err);
              }
              console.log('Upload successful!  Server responded with:', body);

              if (body.success && Object.prototype.toString.call( body.data ) === '[object Array]') {
                let officeLists = body.data
                let officeLen = officeLists.length
                for(let n = 0; n < officeLen; n++) {
                  let officeList = officeLists[n]
                  console.log('officeName officeList:', officeList);
                  if (officeList["officeName"] == "gyj33216") {
                    let text = officeList["text"]
                    console.log('officeName text:', text);
                    m.say(text)
                  }
                }
              }
            })





              } else if (body.success && body.data === 'insert success') {
                  let oDate = new Date()
                    const nMonth = oDate.getMonth() + 1
                    const nDate = oDate.getDate()
                    const remarkName = contact.get('name') + ' ' + nMonth + '.' + nDate
                  const ret = await contact.alias(remarkName)
                  if (ret) {
                      console.log('ok')
                    } else {
                      console.error('failed')
                    }
                    await contact.refresh()
                    log.info('Bot', 'get alias: %s', contact.alias())


                let sendTextUrl = 'http://weixin.jdcf88.com/H5_server/api/Talk/GetTalk?officeName=' + loginAlias
                requestAjax.get({url:sendTextUrl}, async function optionalCallback(err, httpResponse, body) {
              if (err) {
                return console.error('upload failed:', err);
              }
              console.log('Upload successful!  Server responded with:', body);

              if (body.success && Object.prototype.toString.call( body.data ) === '[object Array]') {
                let officeLists = body.data
                let officeLen = officeLists.length
                for(let n = 0; n < officeLen; n++) {
                  let officeList = officeLists[n]
                  if (officeList["officeName"] == loginAlias) {
                    let text = officeList["text"]
                    console.log('officeName text:', text);
                    m.say(text)
                  }
                }
              }
            })



              }
            })
      }
    }
})

.init()

/**
 * Main Contact Bot
 */
async function main() {
  const contactList = await Contact.findAll()

  log.info('Bot', '#######################')
  // log.info('Bot', 'Contact list: (%s)', JSON.stringify(contactList))
  log.info('Bot', 'Contact number: %d\n', contactList.length)
  log.info('Bot', 'hot reload test')
  // if (contactList.length > 1000) {
  //     log.info('Bot', 'Contact list: (%s)', JSON.stringify(contactList))
  // }

requestAjax
const fileHelper = await Contact.load('filehelper')
  fileHelper
  
  const SLEEP = 7
  log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP)
  timer = setTimeout(main, SLEEP * 1000)
  count++

  log.info('Bot', 'Count: (%n)', count)
  
  if (count === 5) {
      // clearTimeout(timer)
      // log.info('Bot', 'loginUser list: (%s) \n', JSON.stringify(loginUser))

      // var formDataLists: string[] = []
      // var formData
      // var loginUIN
      // let len = contactList.length
      // var dataLists: string[] = []
      // for (var i = 0; i < len; i++) {
          
          

      //     var list = contactList[i]
      //     var rawObject = list["rawObj"]
      //     formData = {}
      //     for (var key in rawObject) { 
      //       formData[key] = rawObject[key]
      //     }
      //     loginUIN = loginUser["obj"]

      //     formData["officeName"] = loginAlias || loginUIN["uin"]

      //     formDataLists.push(formData)


      //     if (((i + 1) % 20 === 0) || (i + 1) === len) {
      //         log.info('Bot', 'form data : (%s) \n', JSON.stringify(formDataLists))
      //         requestAjax.post({url:'http://weixin.jdcf88.com/H5_server/api/Friend/SaveFriendDataList', json: true,
      //         headers: {
      //           "content-type": "application/json",
      //         },
      //         body: formDataLists}, function optionalCallback(err, httpResponse, body) {
      //         if (err) {
      //           return console.error('upload failed:', err);
      //         }
      //         console.log('Upload successful!  Server responded with:', body);

      //         if (body.success && Object.prototype.toString.call( body.data ) === '[object Array]') {
      //           dataLists = body.data
      //           for (var j = 0; j < dataLists.length; j++) {
      //               var dataList = dataLists[j]
      //               let repeatContent = "Bot:  重复用户：\n" + "微信号：" + dataList["Alias"] + "\n 用户名：" + dataList["NickName"] + "\n 性别：" + (dataList["Sex"] !== '0' ? (dataList["Sex"] === '1' ? '男' : '女') : '') + "\n 省份：" + dataList["Province"] + "\n 城市：" + dataList["City"] + "\n 签名：" + dataList["Signature"] + "\n 重复微信号：" + dataList["officeName"]
      //               fileHelper.say(repeatContent)
      //           }
      //         }
      //       })

      //       formDataLists.length = 0
      //     }
      // }
      
  }
}

function serverJiang(username,content){
  var request = require('request')
  var url = 'http://sc.ftqq.com/'+SCKEY+'.send'
  var propertiesObject = {text:username,desp:content}

  request({url:url, qs:propertiesObject}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var testjson = JSON.parse(body)
      testjson
    }
  })
}

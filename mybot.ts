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
                    let repeatContent = "Bot:  重复用户：\n" + "微信号：" + dataList["Alias"] + "\n 用户名：" + dataList["NickName"] + "\n 性别：" + (dataList["Sex"] !== '0' ? (dataList["Sex"] === '1' ? '男' : '女') : '') + "\n 省份：" + dataList["Province"] + "\n 城市：" + dataList["City"] + "\n 签名：" + dataList["Signature"]
                    fileHelper.say(repeatContent)

                    await request.accept()
                    const remarkUser = '重复用户 - ' + contact.get('name')
                  const ret = await contact.alias(remarkUser)
                  if (ret) {
                      console.log('ok')
                    } else {
                      console.error('failed')
                    }
                    await contact.refresh()
                    log.info('Bot', 'get alias: %s', contact.alias())

              } else if (body.success && body.data === 'insert success') {
                  await request.accept()
                  let oDate = new Date()
                    const nMonth = oDate.getMonth() + 1
                    const nDate = oDate.getDate()
                    const remarkName = contact.get('name') + nMonth + '.' + nDate
                  const ret = await contact.alias(remarkName)
                  if (ret) {
                      console.log('ok')
                    } else {
                      console.error('failed')
                    }
                    await contact.refresh()
                    log.info('Bot', 'get alias: %s', contact.alias())
              }
            })
        console.log(`Contact: ${contact.name()} send request ${request.hello}`)
    }
})

.on('message', async function(m){
    const contact = m.from()
    const content = m.content()
    const room = m.room()

    if(room){
        console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
    } else{
        console.log(`Contact: ${contact.name()} Content: ${content}`)
    }

    if(m.self()){
        // log.info('Bot', 'self 聊天#######################')
        // log.info('Bot', 'm.self 聊天(%s)', JSON.stringify(m))
        return
    }

    if(/hello/.test(content)){
        m.say("hello how are you")
    }

    if(/room/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.add(contact)
            await keyroom.say("welcome!", contact)
        }
    }

    if(/out/.test(content)){
        let keyroom = await Room.find({topic: "test"})
        if(keyroom){
            await keyroom.say("Remove from the room", contact)
            await keyroom.del(contact)
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
      //               let repeatContent = "Bot:  重复用户：\n" + "微信号：" + dataList["Alias"] + "\n 用户名：" + dataList["NickName"] + "\n 性别：" + (dataList["Sex"] !== '0' ? (dataList["Sex"] === '1' ? '男' : '女') : '') + "\n 省份：" + dataList["Province"] + "\n 城市：" + dataList["City"] + "\n 签名：" + dataList["Signature"]
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

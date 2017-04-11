import {Wechaty, Room, Contact, log} from 'wechaty'
var requestAjax = require('request');
var loginUser
var count = 0
let timer
const bot = Wechaty.instance()

bot
.on('scan', (url, code)=>{
    let loginUrl = url.replace('qrcode', 'l')
    require('qrcode-terminal').generate(loginUrl)
    console.log(url)
})

.on('login', user=>{
    loginUser = user
    console.log(`${user.name()} login`)
    log.info('Bot', 'user list: (%s)', JSON.stringify(user))
    /**
   * Main Contact Bot start from here
   */
    main()

})

.on('friend', async function (contact, request){
    if(request){
        
        // requestAjax('http://yintechjdhr.jdcf88.com/H5_server/api/User/LoginOut?token=123456', async function (error, response, body) {
        //   console.log('error:', error) // Print the error if one occurred 
        //   console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received 
        //   console.log('body:', body) // Print the HTML for the Google homepage. 
        //   if (Math.random() > 0) {
        //     console.log('accept from request: ')
        //     // request.accept()
        //     await request.accept()
        //     let oDate = new Date()
        //     const nMonth = oDate.getMonth() + 1
        //     const nDate = oDate.getDate()
        //     const remarkName = contact.get('name') + nMonth + '.' + nDate
        //     if (contact.alias() === null) {
        //         const ret = await contact.alias(remarkName)
        //         if (ret) {
        //           console.log('ok')
        //         } else {
        //           console.error('failed')
        //         }
        //         await contact.refresh()
        //         log.info('Bot', 'get alias: %s', contact.alias())
        //     }
        //   } else {
        //     console.log('not accept from request: ')
        //   }
        // })
        // console.log(`Contact: ${contact.name()} send request ${request.hello}`)
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
        log.info('Bot', 'self 聊天#######################')
        log.info('Bot', 'm.self 聊天(%s)', JSON.stringify(m))
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
  
  if (count === 3) {
      clearTimeout(timer)
      // log.info('Bot', 'loginUser list: (%s) \n', JSON.stringify(loginUser))

      var formDataLists: string[] = []
      var formData
      var loginUIN
      let len = contactList.length
      var dataLists: string[] = []
      for (var i = 0; i < len; i++) {
          
          

          var list = contactList[i]
          var rawObject = list["rawObj"]
          formData = {}
          for (var key in rawObject) { 
            formData[key] = rawObject[key]
          }
          loginUIN = loginUser["obj"]

          formData["officeName"] = loginUIN["uin"]
          // log.info('Bot', 'form data: (%s) \n', JSON.stringify(formData))
          formDataLists.push(formData)

          if ((i + 1) % 20 === 0) {
              // log.info('Bot', 'formDataLists : (%s) \n', JSON.stringify(formDataLists))
              requestAjax.post({url:'http://weixin.jdcf88.com/H5_server/api/Friend/SaveFriendDataList', json: true,
              headers: {
                "content-type": "application/json",
              },
              body: formDataLists}, function optionalCallback(err, httpResponse, body) {
              if (err) {
                return console.error('upload failed:', err);
              }
              console.log('Upload successful!  Server responded with:', body);
              // fileHelper.say('<img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />')
              // var srcHtml = '<img class="img" src="' + rawObject["HeadImgUrl"] + '" mm-src="' + rawObject["HeadImgUrl"] + '" alt="[强]_web">'
              // fileHelper.say(srcHtml)
              // fileHelper.say(JSON.stringify(body))
              if (body.success && Object.prototype.toString.call( body.data ) === '[object Array]') {
                dataLists = body.data
                for (var j = 0; j < dataLists.length; j++) {
                    var dataList = dataLists[j]
                    let repeatContent = "Bot:  重复用户：\n" + "微信号：" + dataList["Alias"] + "\n 用户名：" + dataList["NickName"] + "\n 性别：" + (dataList["Sex"] !== '0' ? (dataList["Sex"] === '1' ? '男' : '女') : '') + "\n 省份：" + dataList["Province"] + "\n 城市：" + dataList["City"] + "\n 签名：" + dataList["Signature"]
                    fileHelper.say(repeatContent)
                }
              }
            })

            formDataLists.length = 0
          }
      }
      
  }
}
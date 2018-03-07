"use strict";

const express = require("express");
const bodyParser = require("body-parser");
var mysql = require('mysql');
const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
var createConnection = function (cb) {
  var con = mysql.createConnection({
    host: "us-cdbr-iron-east-05.cleardb.net",
    user: "b95532ff8d1308",
    password: "f12a55ef",
    database: "heroku_dd1418457119944",
    port: "3306"
  });

  con.connect(function (err) {
    console.log(err)
    cb(err, con)
  });
}
restService.use(bodyParser.json());

restService.post("/create-ticket", function (req, res) {
  var speech =
    req.body.result &&
      req.body.result.parameters
      ? 'Seems like some problem. Speak again.'
      : '';
  var test = JSON.stringify(req.body);
  console.log(test);
  var type = req.body.result.parameters['Issue_Type.original'];
  var content = req.body.result.parameters['any.original'];
  var assignee = req.body.result.parameters['Assignee.original'];


  console.log(`type ${type}, content ${content}, assignee ${assignee}, ${req.body.result.parameters}`)
  var issue = { 'type': type, 'content': content, 'user': assignee }
  createConnection(function (err, con) {
    if (err) {
      return res.json({
        speech: 'Sorry unable to create ticket',
        displayText: 'Sorry unable to create ticket',
        source: "webhook-echo-sample"
      });
    }

    con.query(`INSERT INTO tickets SET ?`, issue, function (err, result, fields) {
      console.log(err, 'sddddd');
      if (err) {
        return res.json({
          speech: 'Sorry unable to create ticket',
          displayText: 'Sorry unable to create ticket',
          source: "webhook-echo-sample"
        });
      } else {
        return res.json({
          speech: 'Ticket Create Successfully',
          displayText: 'Ticket Create Successfully',
          source: "webhook-echo-sample"
        });
      }
    });
  });

});

// restService.post("/echo", function (req, res) {
//   console.log(req.body)
//   var speech =
//     req.body.result &&
//       req.body.result.parameters &&
//       req.body.result.parameters.echoText
//       ? req.body.result.parameters.echoText
//       : "Seems like some problem. Speak again.";
//   return res.json({
//     speech: speech,
//     displayText: speech,
//     source: "webhook-echo-sample"
//   });
// });

// restService.post("/audio", function (req, res) {
//   var speech = "";
//   console.log('tell me about a switch board', req.body)
//   switch (req.body.result.parameters.AudioSample.toLowerCase()) {
//     //Speech Synthesis Markup Language 
//     case "music one":
//       speech =
//         '<video height="400" width="300" src="youtu.be/MLeIBFYY6UY" controls="true"></video>';
//       break;
//     case "music two":
//       speech =
//         '<speak><audio clipBegin="1s" clipEnd="3s" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music three":
//       speech =
//         '<speak><audio repeatCount="2" soundLevel="-15db" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music four":
//       speech =
//         '<speak><audio speed="200%" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
//       break;
//     case "music five":
//       speech =
//         '<audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio>';
//       break;
//     case "delay":
//       speech =
//         '<speak>Let me take a break for 3 seconds. <break time="3s"/> I am back again.</speak>';
//       break;
//     //https://www.w3.org/TR/speech-synthesis/#S3.2.3
//     case "cardinal":
//       speech = '<speak><say-as interpret-as="cardinal">12345</say-as></speak>';
//       break;
//     case "ordinal":
//       speech =
//         '<speak>I stood <say-as interpret-as="ordinal">10</say-as> in the class exams.</speak>';
//       break;
//     case "characters":
//       speech =
//         '<speak>Hello is spelled as <say-as interpret-as="characters">Hello</say-as></speak>';
//       break;
//     case "fraction":
//       speech =
//         '<speak>Rather than saying 24+3/4, I should say <say-as interpret-as="fraction">24+3/4</say-as></speak>';
//       break;
//     case "bleep":
//       speech =
//         '<speak>I do not want to say <say-as interpret-as="bleep">F&%$#</say-as> word</speak>';
//       break;
//     case "unit":
//       speech =
//         '<speak>This road is <say-as interpret-as="unit">50 foot</say-as> wide</speak>';
//       break;
//     case "verbatim":
//       speech =
//         '<speak>You spell HELLO as <say-as interpret-as="verbatim">hello</say-as></speak>';
//       break;
//     case "date one":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="yyyymmdd" detail="1">2017-12-16</say-as></speak>';
//       break;
//     case "date two":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="dm" detail="1">16-12</say-as></speak>';
//       break;
//     case "date three":
//       speech =
//         '<speak>Today is <say-as interpret-as="date" format="dmy" detail="1">16-12-2017</say-as></speak>';
//       break;
//     case "time":
//       speech =
//         '<speak>It is <say-as interpret-as="time" format="hms12">2:30pm</say-as> now</speak>';
//       break;
//     case "telephone one":
//       speech =
//         '<speak><say-as interpret-as="telephone" format="91">09012345678</say-as> </speak>';
//       break;
//     case "telephone two":
//       speech =
//         '<speak><say-as interpret-as="telephone" format="1">(781) 771-7777</say-as> </speak>';
//       break;
//     // https://www.w3.org/TR/2005/NOTE-ssml-sayas-20050526/#S3.3
//     case "alternate":
//       speech =
//         '<speak>IPL stands for <sub alias="indian premier league">IPL</sub></speak>';
//       break;
//   }
//   return res.json({
//     speech: speech,
//     displayText: speech,
//     source: "webhook-echo-sample",
//     test: 'cool'
//   });
// });

// restService.post("/video", function (req, res) {
//   return res.json({
//     speech: 'Enjoy the video',
//     displayText: 'Enjoy the video',
//     source: "webhook-echo-sample",
//     data: {
//       content: `<video controls="true">
//       <source src="https://s3.amazonaws.com/collaterals.compas.siemens-info.com/Content_Upload/Videos/V3_3D_Product_Videos/SIE_VI_LoadCenter.mp4"  type="video/mp4"/>
//   </video>`,
//       type: 'video'
//     }
//   });
// });

// restService.post("/slack-test", function (req, res) {
//   var slack_message = {
//     text: "Details of JIRA board for Browse and Commerce",
//     attachments: [
//       {
//         title: "JIRA Board",
//         title_link: "http://www.google.com",
//         color: "#36a64f",

//         fields: [
//           {
//             title: "Epic Count",
//             value: "50",
//             short: "false"
//           },
//           {
//             title: "Story Count",
//             value: "40",
//             short: "false"
//           }
//         ],

//         thumb_url:
//           "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
//       },
//       {
//         title: "Story status count",
//         title_link: "http://www.google.com",
//         color: "#f49e42",

//         fields: [
//           {
//             title: "Not started",
//             value: "50",
//             short: "false"
//           },
//           {
//             title: "Development",
//             value: "40",
//             short: "false"
//           },
//           {
//             title: "Development",
//             value: "40",
//             short: "false"
//           },
//           {
//             title: "Development",
//             value: "40",
//             short: "false"
//           }
//         ]
//       }
//     ]
//   };
//   return res.json({
//     speech: "speech",
//     displayText: "speech",
//     source: "webhook-echo-sample",
//     data: {
//       slack: slack_message
//     }
//   });
// });

restService.listen(process.env.PORT || 8000, function () {
  console.log("Server up and listening");
});

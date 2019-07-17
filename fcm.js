import dotenv from "dotenv";
const FCM = require("fcm-node");
const fcm = new FCM(process.env.SERVER_KEY);
dotenv.config();

/** 안드로이드 단말에서 추출한 token값 */
// 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
// 안드로이드 단말에서 Node server로 POST방식 전송 후,
// Node서버는 이 값을 DB에 보관하고 있으면 된다.
const client_token =
  "fCfVzlhF50Q:APA91bECSDkr04TVzmI-Rtd1cxIGBHEuDYCZyvOuc254mx-AwtIZkiOw22y7fDv1uYbWuxbzXwwn6fv_Ut7n2_-LcLN3heohBV20MG_uFWsHm8dw2bMX9oRI10BQPNeXqMaaf8_Fhopi";

/** 발송할 Push 메시지 내용 */
const push_data = {
  // 수신대상
  to: client_token,
  project_id: process.env.SENDER_ID,
  // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
  notification: {
    title: "Hello Node",
    body: "Node로 발송하는 Push 메시지 입니다.",
    sound: "default",
    click_action: "FCM_PLUGIN_ACTIVITY",
    icon: "fcm_push_icon"
  },
  // 메시지 중요도
  priority: "high",
  // App 패키지 이름
  restricted_package_name: "study.cordova.fcmclient",
  // App에게 전달할 데이터
  data: {
    num1: 2000,
    num2: 3000
  }
};

/** 아래는 푸시메시지 발송절차 */
fcm.send(push_data, function(err, response) {
  if (err) {
    console.error("Push메시지 발송에 실패했습니다.");
    console.error(err);
    return;
  }

  console.log("Push메시지가 발송되었습니다.");
  console.log(response);
});

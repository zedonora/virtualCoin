import firebase from "firebase";
//TODO: Add SDKs for Firebase products that you want to use https://firebase.google.com/docs/web/setup#config-web-app

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_3GQnx7pTdQqCm5JolYgCQTqhVgTDO80",
  authDomain: "trade-df544.firebaseapp.com",
  databaseURL: "https://trade-df544.firebaseio.com",
  projectId: "trade-df544",
  storageBucket: "",
  messagingSenderId: "89502274838",
  appId: "1:89502274838:web:65dbfbd6e2d1a890"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

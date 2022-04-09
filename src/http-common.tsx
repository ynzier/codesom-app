import * as axios from "axios";

export default axios.default.create({
  // local http://192.168.2.48:4000
  // online https://api.knt-dev.online
  baseURL: "https://api.knt-dev.online/",
  timeout: 3000,
  timeoutErrorMessage: "การเชื่อมต่อขัดข้อง",
});

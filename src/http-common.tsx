import * as axios from "axios";

export default axios.default.create({
  // local 192.168.2.48:4000
  // online api.knt-dev.online
  baseURL: "http://api.knt-dev.online/",
  timeout: 3000,
  timeoutErrorMessage: "การเชื่อมต่อขัดข้อง",
});

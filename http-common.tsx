import * as axios from "axios";

export default axios.default.create({
  // local 192.168.1.34:4000
  // online api.knt-dev.online
  baseURL: "http://192.168.2.49:4000/",
  timeout: 3000,
  timeoutErrorMessage: "การเชื่อมต่อขัดข้อง",
});

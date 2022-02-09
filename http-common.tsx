import * as axios from "axios";

export default axios.default.create({
  baseURL: "http://api.knt-dev.online/",
  timeout: 3000,
  timeoutErrorMessage: "การเชื่อมต่อขัดข้อง",
});

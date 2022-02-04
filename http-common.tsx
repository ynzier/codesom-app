/// <reference path="axios.d.ts" />
import * as axios from "axios";

export default axios.create({
  baseURL: "http://api.knt-dev.online/",
});

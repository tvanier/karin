import { makeUrl, getForceOptions } from "../template/help";
import xhrPost from "./open/post";

export default function post(param, ...keys) {
  var callOrReturn = null;
  if (param.constructor === Object) {
    callOrReturn = true;
  } else {
    callOrReturn = false;
  }

  function t() {
    var chunks = callOrReturn ? arguments[0] : param;
    var interpolations = callOrReturn ? [].slice.call(arguments, 1) : keys;

    var settings = callOrReturn ? param : { headers: {}, encode: "" };

    var options = {
      headers: {
        ...settings.headers,
      },
      encode: "",
      ...settings,
    };

    let str = makeUrl(chunks, interpolations, true);

    let postData = interpolations[interpolations.length - 1];

    if (typeof postData === "object") {
      postData = JSON.stringify(postData);
      options.headers["Content-Type"] = "application/json";
    }

    let normalizeUrl = getForceOptions(str, b => {
      if (b === "json") {
        options.encode = "json";
      }
      if (b === "raw") {
        options.encode = "raw";
      }
    });

    if (options.origin) {
      normalizeUrl = `${options.origin}${normalizeUrl}`;
    }
    return xhrPost(normalizeUrl, options, postData);
  }
  if (callOrReturn) {
    return t;
  } else {
    return t();
  }
}

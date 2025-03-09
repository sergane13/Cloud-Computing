package org.main.Handlers;

import org.json.JSONObject;
import org.main.Static.ResponseData;

public interface ProcessRequest {
    ResponseData processRequest(JSONObject requestBodyJson);
}

package org.main.Static;
import org.json.JSONObject;

public class ResponseData {
    private final JSONObject jsonObject;
    private final int statusCode;

    public ResponseData(JSONObject jsonMessage, int statusCode) {
        this.jsonObject = jsonMessage;
        this.statusCode = statusCode;
    }

    public JSONObject getJsoObject() {
        return jsonObject;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
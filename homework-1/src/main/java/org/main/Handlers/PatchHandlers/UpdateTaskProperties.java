package org.main.Handlers.PatchHandlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONObject;
import org.main.Db.DbCommunication;
import org.main.Db.PostgresConnection;
import org.main.Handlers.PathsHandler;
import org.main.Handlers.ProcessRequest;
import org.main.Static.HTTP_CODES;
import org.main.Static.HTTP_VERBS;
import org.main.Static.ResponseData;

import java.io.IOException;

public class UpdateTaskProperties implements HttpHandler, ProcessRequest {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        PathsHandler.handleRequest(exchange, HTTP_VERBS.PATCH, this);
    }

    public ResponseData processRequest(JSONObject requestBodyJson) {
        JSONObject dataJson = new JSONObject();

        int taskId = requestBodyJson.optInt("id", -1);
        if (taskId == -1) {
            dataJson.put("error", "Task ID is required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        if (!DbCommunication.doesTaskExist(PostgresConnection.getInstance().getConnection(), taskId)) {
            dataJson.put("message", "Task does not exist");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        if (requestBodyJson.has("status")) {
            return updateTaskStatus(taskId, requestBodyJson.optString("status", "").trim());
        } else if (requestBodyJson.has("assigned_to")) {
            return updateTaskUser(taskId, requestBodyJson.optString("assigned_to", "").trim());
        } else {
            dataJson.put("error", "Request must include either 'status' or 'assigned_to'");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }
    }

    private ResponseData updateTaskStatus(int taskId, String status) {
        JSONObject dataJson = new JSONObject();

        if (status.isEmpty()) {
            dataJson.put("error", "Status is required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        boolean response = DbCommunication.updateTaskStatus(PostgresConnection.getInstance().getConnection(), taskId, status);

        if (response) {
            return new ResponseData(dataJson, HTTP_CODES.NO_CONTENT);
        } else {
            dataJson.put("message", "Failed to update task status");
            return new ResponseData(dataJson, HTTP_CODES.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseData updateTaskUser(int taskId, String assignedTo) {
        JSONObject dataJson = new JSONObject();

        if (assignedTo.isEmpty()) {
            dataJson.put("error", "Assigned_to is required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        boolean response = DbCommunication.updateTaskAsignee(PostgresConnection.getInstance().getConnection(), taskId, assignedTo);
        if (response) {
            return new ResponseData(dataJson, HTTP_CODES.NO_CONTENT);
        } else {
            dataJson.put("message", "Failed to update task assignment");
            return new ResponseData(dataJson, HTTP_CODES.INTERNAL_SERVER_ERROR);
        }
    }
}

package org.main.Handlers.DeleteHandlers;

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

public class DeleteTaskByProperty implements HttpHandler, ProcessRequest {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        PathsHandler.handleRequest(exchange, HTTP_VERBS.DELETE, this);
    }

    public ResponseData processRequest(JSONObject requestBodyJson) {
        JSONObject dataJson = new JSONObject();

        if (requestBodyJson.has("status")) {
            return deleteTasksByStatus(requestBodyJson.optString("status", "").trim());
        } else if (requestBodyJson.has("assigned_to")) {
            return deleteTasksByAssignee(requestBodyJson.optString("assigned_to", "").trim());
        } else {
            dataJson.put("error", "Request must include either 'status' or 'assigned_to'");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }
    }

    private ResponseData deleteTasksByStatus(String status) {
        JSONObject dataJson = new JSONObject();

        if (status.isEmpty()) {
            dataJson.put("error", "Status is required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        boolean response = DbCommunication.deleteTasksByStatus(PostgresConnection.getInstance().getConnection(), status);

        if (response) {
            return new ResponseData(dataJson, HTTP_CODES.NO_CONTENT);
        } else {
            dataJson.put("message", "Failed to delete tasks by status");
            return new ResponseData(dataJson, HTTP_CODES.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseData deleteTasksByAssignee(String assignedTo) {
        JSONObject dataJson = new JSONObject();

        if (assignedTo.isEmpty()) {
            dataJson.put("error", "Assigned user is required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        if (!DbCommunication.doesUserExist(PostgresConnection.getInstance().getConnection(), assignedTo)) {
            dataJson.put("message", "User does not exist");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        boolean response = DbCommunication.deleteTasksByAssignee(PostgresConnection.getInstance().getConnection(), assignedTo);

        if (response) {
            return new ResponseData(dataJson, HTTP_CODES.NO_CONTENT);
        } else {
            dataJson.put("message", "Failed to delete tasks by user");
            return new ResponseData(dataJson, HTTP_CODES.INTERNAL_SERVER_ERROR);
        }
    }
}

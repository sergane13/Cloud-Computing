package org.main.Handlers.PutHandlers;

import com.sun.net.httpserver.HttpHandler;
import org.main.Handlers.ProcessRequest;

import com.sun.net.httpserver.HttpExchange;
import org.json.JSONObject;
import org.main.Db.DbCommunication;
import org.main.Db.Entity.Task;
import org.main.Db.PostgresConnection;
import org.main.Handlers.PathsHandler;
import org.main.Static.HTTP_CODES;
import org.main.Static.HTTP_VERBS;
import org.main.Static.ResponseData;
import java.time.LocalDateTime;

import java.io.IOException;

public class UpdateTask implements HttpHandler, ProcessRequest {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        PathsHandler.handleRequest(exchange, HTTP_VERBS.PUT, this);
    }

    public ResponseData processRequest(JSONObject requestBodyJson) {
        JSONObject dataJson = new JSONObject();

        int taskId = requestBodyJson.optInt("id", -1);
        if (taskId == -1) {
            dataJson.put("error", "Task ID is required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        String title = requestBodyJson.optString("title", "").trim();
        String description = requestBodyJson.optString("description", "").trim();
        String status = requestBodyJson.optString("status", "").trim();
        String assignedTo = requestBodyJson.optString("assignedTo", "").trim();
        String dueDateStr = requestBodyJson.optString("dueDate", "").trim();

        if (title.isEmpty() || description.isEmpty() || status.isEmpty()) {
            dataJson.put("error", "Title, description, and status are required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        LocalDateTime dueDate = dueDateStr.isEmpty() ? null : LocalDateTime.parse(dueDateStr);
        LocalDateTime createdAt = LocalDateTime.now();

        Task task = new Task.TaskBuilder()
                .setId(taskId)
                .setTitle(title)
                .setDescription(description)
                .setAssignedTo(assignedTo)
                .setStatus(status)
                .setDueDate(dueDate)
                .setCreatedAt(createdAt)
                .build();

        if (!DbCommunication.doesTaskExist(PostgresConnection.getInstance().getConnection(), taskId)) {
            dataJson.put("message", "Task does not exist");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        boolean response = DbCommunication.updateTask(PostgresConnection.getInstance().getConnection(), task);

        if (response) {
            return new ResponseData(dataJson, HTTP_CODES.NO_CONTENT);
        } else {
            dataJson.put("message", "Failed to update task");
            return new ResponseData(dataJson, HTTP_CODES.INTERNAL_SERVER_ERROR);
        }
    }
}

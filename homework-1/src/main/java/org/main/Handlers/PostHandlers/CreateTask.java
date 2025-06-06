package org.main.Handlers.PostHandlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONObject;
import org.main.Db.DbCommunication;
import org.main.Db.Entity.Task;
import org.main.Db.PostgresConnection;
import org.main.Handlers.PathsHandler;
import org.main.Handlers.ProcessRequest;
import org.main.Static.HTTP_CODES;
import org.main.Static.HTTP_VERBS;
import org.main.Static.ResponseData;
import java.time.LocalDateTime;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// POST /tasks
public class CreateTask implements HttpHandler, ProcessRequest {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        PathsHandler.handleRequest(exchange, HTTP_VERBS.POST, this);
    }

    public ResponseData processRequest(JSONObject requestBodyJson) {
        JSONObject dataJson = new JSONObject();

        String title = requestBodyJson.optString("title", "").trim();
        String description = requestBodyJson.optString("description", "").trim();
        String status = requestBodyJson.optString("status", "pending").trim();
        String assignedTo = requestBodyJson.optString("assignedTo", "").trim();
        String dueDateStr = requestBodyJson.optString("dueDate", "").trim();

        if (title.isEmpty() || description.isEmpty()) {
            dataJson.put("error", "Title and description are required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        LocalDateTime dueDate = dueDateStr.isEmpty() ? null : LocalDateTime.parse(dueDateStr);
        LocalDateTime createdAt = LocalDateTime.now();

        Task task  = new Task.
                TaskBuilder()
                .setTitle(title)
                .setDescription(description)
                .setAssignedTo(assignedTo)
                .setStatus(status)
                .setDueDate(dueDate)
                .setCreatedAt(createdAt)
                        .build();

        List<Task> tasks = new ArrayList<>();
        tasks.add(task);
        boolean response = DbCommunication.addTask(PostgresConnection.getInstance().getConnection(), tasks);

        if (response) {
            dataJson.put("message", "Task created successfully");
            return new ResponseData(dataJson, HTTP_CODES.CREATED);
        } else {
            dataJson.put("message", "Failed to add task");
            return new ResponseData(dataJson, HTTP_CODES.INTERNAL_SERVER_ERROR);
        }
    }
}

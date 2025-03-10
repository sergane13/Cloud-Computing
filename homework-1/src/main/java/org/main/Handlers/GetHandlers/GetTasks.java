package org.main.Handlers.GetHandlers;

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

import java.io.IOException;
import java.util.List;

public class GetTasks implements HttpHandler, ProcessRequest {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        PathsHandler.handleRequest(exchange, HTTP_VERBS.GET, this);
    }

    public ResponseData processRequest(JSONObject requestBodyJson) {
        JSONObject dataJson = new JSONObject();
        JSONObject tasksJson = new JSONObject();
        List<Task> tasks;

        if (requestBodyJson.has("username")) {
            String username = requestBodyJson.optString("username", "").trim();

            if (username.isEmpty()) {
                dataJson.put("error", "Username is required");
                return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
            }

            if (!DbCommunication.doesUserExist(PostgresConnection.getInstance().getConnection(), username)) {
                dataJson.put("error", "User does not exist");
                return new ResponseData(dataJson, HTTP_CODES.NOT_FOUND);
            }

            tasks = DbCommunication.getAllTasks(PostgresConnection.getInstance().getConnection(), username);
        } else {
            tasks = DbCommunication.getAllTasks(PostgresConnection.getInstance().getConnection(), "");
        }

        for (Task task : tasks) {
            JSONObject taskJson = new JSONObject();
            taskJson.put("title", task.getTitle());
            taskJson.put("description", task.getDescription());
            taskJson.put("status", task.getStatus());
            taskJson.put("assigned_to", task.getAssignedTo());
            taskJson.put("due_date", task.getDueDate() != null ? task.getDueDate().toString() : null);
            taskJson.put("created_at", task.getCreatedAt().toString());

            tasksJson.put(String.valueOf(task.getId()), taskJson);
        }

        dataJson.put("tasks", tasksJson);
        return new ResponseData(dataJson, HTTP_CODES.OK);
    }
}
package org.main.Handlers.PostHandlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONObject;
import org.main.Db.DbCommunication;
import org.main.Db.Entity.User;
import org.main.Db.PostgresConnection;
import org.main.Handlers.PathsHandler;
import org.main.Handlers.ProcessRequest;
import org.main.Static.HTTP_CODES;
import org.main.Static.HTTP_VERBS;
import org.main.Static.ResponseData;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CreateUser implements HttpHandler, ProcessRequest {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        PathsHandler.handleRequest(exchange, HTTP_VERBS.POST, this);
    }

    public ResponseData processRequest(JSONObject requestBodyJson) {
        JSONObject dataJson = new JSONObject();

        String username = requestBodyJson.optString("username", "").trim();
        String email = requestBodyJson.optString("email", "").trim();
        String password = requestBodyJson.optString("password", "").trim();
        String createdAtStr = requestBodyJson.optString("createdAt", "").trim();
        String updatedAtStr = requestBodyJson.optString("updatedAt", "").trim();

        if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
            dataJson.put("error", "Username, email, and password are required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        if (DbCommunication.doesUserExist(PostgresConnection.getInstance().getConnection(), username)) {
            dataJson.put("message", "User already exists");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        LocalDateTime createdAt = createdAtStr.isEmpty() ? LocalDateTime.now() : LocalDateTime.parse(createdAtStr);
        LocalDateTime updatedAt = updatedAtStr.isEmpty() ? LocalDateTime.now() : LocalDateTime.parse(updatedAtStr);

        List<User> users = new ArrayList<>();

        User user = new User.UserBuilder()
                .setUsername(username)
                .setEmail(email)
                .setPassword(password)
                .setCreatedAt(createdAt)
                .setUpdatedAt(updatedAt)
                .build();

        users.add(user);

        boolean response = DbCommunication.addUser(PostgresConnection.getInstance().getConnection(), users);

        if (response) {
            dataJson.put("message", "Users created successfully");
            return new ResponseData(dataJson, HTTP_CODES.CREATED);
        } else {
            dataJson.put("message", "Failed to add users");
            return new ResponseData(dataJson, HTTP_CODES.INTERNAL_SERVER_ERROR);
        }
    }
}
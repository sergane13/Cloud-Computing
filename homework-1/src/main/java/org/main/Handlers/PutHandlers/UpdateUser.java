package org.main.Handlers.PutHandlers;

import com.sun.net.httpserver.HttpHandler;
import org.main.Handlers.ProcessRequest;

import com.sun.net.httpserver.HttpExchange;
import org.json.JSONObject;
import org.main.Db.DbCommunication;
import org.main.Db.PostgresConnection;
import org.main.Handlers.PathsHandler;
import org.main.Static.HTTP_CODES;
import org.main.Static.HTTP_VERBS;
import org.main.Static.ResponseData;

import java.io.IOException;

public class UpdateUser implements HttpHandler, ProcessRequest {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        PathsHandler.handleRequest(exchange, HTTP_VERBS.PUT, this);
    }

    public ResponseData processRequest(JSONObject requestBodyJson) {
        JSONObject dataJson = new JSONObject();

        String username = requestBodyJson.optString("username", "").trim();
        String newPassword = requestBodyJson.optString("newPassword", "").trim();
        String newEmail = requestBodyJson.optString("newEmail", "").trim();

        if (username.isEmpty() || newPassword.isEmpty() || newEmail.isEmpty()) {
            dataJson.put("error", "Username, new password, and new email are required");
            return new ResponseData(dataJson, HTTP_CODES.BAD_REQUEST);
        }

        if (!DbCommunication.doesUserExist(PostgresConnection.getInstance().getConnection(), username)) {
            dataJson.put("error", "User does not exist");
            return new ResponseData(dataJson, HTTP_CODES.NOT_FOUND);
        }

        boolean response = DbCommunication.updateUser(PostgresConnection.getInstance().getConnection(), username, newPassword, newEmail);

        if (response) {
            return new ResponseData(dataJson, HTTP_CODES.NO_CONTENT);
        } else {
            dataJson.put("message", "Failed to update user");
            return new ResponseData(dataJson, HTTP_CODES.INTERNAL_SERVER_ERROR);
        }
    }
}


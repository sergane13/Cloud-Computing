package org.main.Handlers.GetHandlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONObject;
import org.main.Db.DbCommunication;
import org.main.Db.Entity.Task;
import org.main.Db.Entity.User;
import org.main.Db.PostgresConnection;
import org.main.Handlers.PathsHandler;
import org.main.Handlers.ProcessRequest;
import org.main.Static.HTTP_CODES;
import org.main.Static.HTTP_VERBS;
import org.main.Static.ResponseData;

import java.io.IOException;
import java.util.List;

public class GetUsers implements HttpHandler, ProcessRequest {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        PathsHandler.handleRequest(exchange, HTTP_VERBS.GET, this);
    }

    public ResponseData processRequest(JSONObject requestBodyJson) {
        JSONObject dataJson = new JSONObject();
        JSONObject usersJson = new JSONObject();

        List<User> users = DbCommunication.getAllUsers(PostgresConnection.getInstance().getConnection());

        for (User user : users) {
            JSONObject userJson = new JSONObject();
            userJson.put("id", user.getId());
            userJson.put("username", user.getUsername());
            userJson.put("email", user.getEmail());
            userJson.put("created_at", user.getCreatedAt().toString());

            usersJson.put(String.valueOf(user.getId()), userJson);
        }

        dataJson.put("users", usersJson);
        return new ResponseData(dataJson, HTTP_CODES.OK);
    }
}
package org.main.Handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.main.Handlers.GetHandlers.GetTasks;
import org.main.Handlers.GetHandlers.GetUsers;
import org.main.Handlers.PostHandlers.CreateTask;
import org.main.Handlers.PostHandlers.CreateUser;
import org.main.Handlers.PutHandlers.UpdateTask;
import org.main.Handlers.PutHandlers.UpdateUser;
import org.main.Static.HTTP_VERBS;

import java.io.IOException;

public class UserHandler implements HttpHandler {
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String verb_  = HTTP_VERBS.fromString(method);

        switch (verb_) {
            case HTTP_VERBS.GET:
                new GetUsers().handle(exchange);
                break;
            case HTTP_VERBS.POST:
                new CreateUser().handle(exchange);
                break;
            case HTTP_VERBS.PUT:
                new UpdateUser().handle(exchange);
                break;
            case HTTP_VERBS.OPTIONS:
                PathsHandler.handleCors(exchange);
                break;
        }
    }
}

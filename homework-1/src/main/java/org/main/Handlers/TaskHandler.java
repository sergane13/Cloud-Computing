package org.main.Handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.main.Handlers.DeleteHandlers.DeleteTaskByProperty;
import org.main.Handlers.GetHandlers.GetTasks;
import org.main.Handlers.PatchHandlers.UpdateTaskProperties;
import org.main.Handlers.PostHandlers.CreateTask;
import org.main.Handlers.PutHandlers.UpdateTask;
import org.main.Static.HTTP_VERBS;

import java.io.IOException;

public class TaskHandler implements HttpHandler {
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String verb_  = HTTP_VERBS.fromString(method);

        switch (verb_) {
            case HTTP_VERBS.GET:
                new GetTasks().handle(exchange);
                break;
            case HTTP_VERBS.POST:
                new CreateTask().handle(exchange);
                break;
            case HTTP_VERBS.PUT:
                new UpdateTask().handle(exchange);
                break;
            case HTTP_VERBS.PATCH:
                new UpdateTaskProperties().handle(exchange);
                break;
            case HTTP_VERBS.DELETE:
                new DeleteTaskByProperty().handle(exchange);
                break;
            case HTTP_VERBS.OPTIONS:
                PathsHandler.handleCors(exchange);
                break;
        }
    }
}

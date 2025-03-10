package org.main;
import org.main.Handlers.TaskHandler;
import org.main.Handlers.UserHandler;
import org.main.Server.Server;

import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            Server server = Server.getInstance();
            server.startServer();

            server.createContext("/tasks", new TaskHandler());
            server.createContext("/users", new UserHandler());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

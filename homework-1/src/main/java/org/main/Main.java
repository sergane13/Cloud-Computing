package org.main;

import org.main.Db.PostgresConnection;
import org.main.Handlers.GetHandlers.GetTasks;
import org.main.Server.Server;

import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            Server server = Server.getInstance();
            server.startServer();

            server.createContext("/task", new GetTasks());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

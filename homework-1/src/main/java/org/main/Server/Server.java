package org.main.Server;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Server {
    private static final int PORT = 8080;
    private static Server instance;
    private static HttpServer server;

    private Server() throws IOException {
        server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.setExecutor(null);
    }

    public static synchronized Server getInstance() throws IOException {
        if (instance == null) {
            instance = new Server();
        }
        return instance;
    }

    public void startServer() {
        if (server != null) {
            server.start();
            System.out.println("Server started on port " + PORT);
        }
    }

    public void stopServer() {
        if (server != null) {
            server.stop(0);
            System.out.println("Server stopped.");
        }
    }

    public void createContext(String path, HttpHandler handler) {
        if (server != null) {
            server.createContext(path, handler);
            System.out.println("Context created: " + path);
        }
    }
}

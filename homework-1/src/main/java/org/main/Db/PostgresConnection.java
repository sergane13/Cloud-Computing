package org.main.Db;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class PostgresConnection {
    private static PostgresConnection instance;
    private static Connection connection;

    private PostgresConnection() {
        String url = "jdbc:postgresql://localhost:5432/cloud_data";
        String user = "serban.chisca";
        String password = "";

        try{
            PostgresConnection.connection = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to PostgreSQL successfully!");
        } catch (SQLException e) {
            System.err.println("Connection failed: " + e.getMessage());
        }
    }

    public static PostgresConnection getInstance() {
        if (instance == null) {
            instance = new PostgresConnection();
        }
        return instance;
    }

    public Connection getConnection() {
        return connection;
    }
}

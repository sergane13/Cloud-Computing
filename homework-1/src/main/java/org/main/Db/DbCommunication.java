package org.main.Db;

import org.main.Db.Entity.Task;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DbCommunication {
    public static List<Task> getAllTasks(Connection conn) {
        List<Task> tasks = new ArrayList<>();
        String query = "SELECT id, title, description, status, assigned_to, due_date, created_at FROM tasks";

        try {
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String description = rs.getString("description");
                String status = rs.getString("status");
                String assignedTo = rs.getString("assigned_to");
                LocalDateTime dueDate = rs.getTimestamp("due_date") != null ? rs.getTimestamp("due_date").toLocalDateTime() : null;
                LocalDateTime createdAt = rs.getTimestamp("created_at").toLocalDateTime();

                tasks.add(new Task.TaskBuilder()
                        .setId(id)
                        .setTitle(title)
                        .setDescription(description)
                        .setStatus(status)
                        .setAssignedTo(assignedTo)
                        .setDueDate(dueDate)
                        .setCreatedAt(createdAt)
                        .build());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return tasks;
    }

    public static List<Task> getUserTasks(Connection conn) {return null}

    //    SELECT * FROM tasks;
    //    SELECT * FROM tasks WHERE id = 1;

    //  UPDATE tasks
    //SET status = 'completed', assigned_to = 'jane@example.com'
    //WHERE id = 1
    //RETURNING *;


    // DELETE FROM tasks WHERE id = 1 RETURNING *;
    // DELETE FROM tasks;

}

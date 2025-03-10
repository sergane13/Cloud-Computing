package org.main.Db;

import org.main.Db.Entity.Task;
import org.main.Db.Entity.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DbCommunication {
    public static List<Task> getAllTasks(Connection conn, String username) {
        List<Task> tasks = new ArrayList<>();
        String query;

        if (username.equals("")){
            query = "SELECT id, title, description, status, assigned_to, due_date, created_at FROM tasks";
        } else {
            query = "SELECT id, title, description, status, assigned_to, due_date, created_at FROM tasks WHERE assigned_to = ?";
        }

        try {
            PreparedStatement ps = conn.prepareStatement(query);

            if (!username.equals("")) {
                ps.setString(1, username);
            }

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
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }

        return tasks;
    }

    public static List<User> getAllUsers(Connection conn) {
        List<User> users = new ArrayList<>();
        String query = "SELECT id, username, email, created_at FROM users";

        try {
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("id");
                String username = rs.getString("username");
                String email = rs.getString("email");
                LocalDateTime createdAt = rs.getTimestamp("created_at").toLocalDateTime();

                users.add(new User.UserBuilder()
                        .setId(id)
                        .setUsername(username)
                        .setEmail(email)
                        .setCreatedAt(createdAt)
                        .build());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }

        return users;
    }

    public static boolean addTask(Connection conn, List<Task> tasks) {
        String query = "INSERT INTO tasks (title, description, status, assigned_to, due_date, created_at) VALUES (?, ?, ?, ?, ?, ?)";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            for (Task task : tasks) {
                ps.setString(1, task.getTitle());
                ps.setString(2, task.getDescription());
                ps.setString(3, task.getStatus());
                ps.setString(4, task.getAssignedTo());
                ps.setTimestamp(5, java.sql.Timestamp.valueOf(task.getDueDate()));
                ps.setTimestamp(6, java.sql.Timestamp.valueOf(LocalDateTime.now()));
                ps.addBatch();
            }

            int[] rowsAffected = ps.executeBatch();
            return rowsAffected.length > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean addUser(Connection conn, List<User> users) {
        String query = "INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            for (User user : users) {
                ps.setString(1, user.getUsername());
                ps.setString(2, user.getEmail());
                ps.setString(3, user.getPassword());
                ps.setTimestamp(4, java.sql.Timestamp.valueOf(user.getCreatedAt()));
                ps.setTimestamp(5, java.sql.Timestamp.valueOf(user.getUpdatedAt()));
                ps.addBatch();
            }

            int[] rowsAffected = ps.executeBatch();
            return rowsAffected.length > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean updateTask(Connection conn, Task task) {
        String query = "UPDATE tasks SET title = ?, description = ?, status = ?, assigned_to = ?, due_date = ?, created_at = ? WHERE id = ?";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, task.getTitle());
            ps.setString(2, task.getDescription());
            ps.setString(3, task.getStatus());
            ps.setString(4, task.getAssignedTo());
            ps.setTimestamp(5, task.getDueDate() != null ? java.sql.Timestamp.valueOf(task.getDueDate()) : null);
            ps.setTimestamp(6, java.sql.Timestamp.valueOf(task.getCreatedAt()));
            ps.setInt(7, task.getId());

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean updateUser(Connection conn, String username, String newPassword, String newEmail) {
        String query = "UPDATE users SET password = ?, email = ?, updated_at = ? WHERE username = ?";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, newPassword);
            ps.setString(2, newEmail);
            ps.setTimestamp(3, java.sql.Timestamp.valueOf(LocalDateTime.now()));
            ps.setString(4, username);

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public static boolean updateTaskStatus(Connection conn, int taskId, String status) {
        String query = "UPDATE tasks SET status = ? WHERE id = ?";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, status);
            ps.setInt(2, taskId);

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean updateTaskAsignee(Connection conn, int taskId, String assignedTo) {
        String query = "UPDATE tasks SET assigned_to = ? WHERE id = ?";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, assignedTo);
            ps.setInt(2, taskId);

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean deleteTasksByStatus(Connection conn, String status) {
        String query = "DELETE FROM tasks WHERE status = ?";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, status);
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean deleteTasksByAssignee(Connection conn, String assignedTo) {
        String query = "DELETE FROM tasks WHERE assigned_to = ?";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, assignedTo);
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean doesUserExist(Connection conn, String assignedTo) {
        String query = "SELECT COUNT(*) FROM users WHERE username = ?";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, assignedTo);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static boolean doesTaskExist(Connection conn, int taskId) {
        String query = "SELECT COUNT(*) FROM tasks WHERE id = ?";

        try (PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, taskId);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }


}

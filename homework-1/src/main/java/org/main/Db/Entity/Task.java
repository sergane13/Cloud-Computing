package org.main.Db.Entity;
import java.time.LocalDateTime;

public class Task {
    private final int id;
    private final String title;
    private final String description;
    private final String status;
    private final String assignedTo;
    private final LocalDateTime dueDate;
    private final LocalDateTime createdAt;

    private Task(TaskBuilder builder) {
        this.id = builder.id;
        this.title = builder.title;
        this.description = builder.description;
        this.status = builder.status;
        this.assignedTo = builder.assignedTo;
        this.dueDate = builder.dueDate;
        this.createdAt = builder.createdAt;
    }

    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getAssignedTo() { return assignedTo; }
    public LocalDateTime getDueDate() { return dueDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "Task{id=" + id + ", title='" + title + "', description='" + description +
                "', status='" + status + "', assignedTo='" + assignedTo +
                "', dueDate=" + dueDate + ", createdAt=" + createdAt + "}";
    }

    // 🚀 Builder Class
    public static class TaskBuilder {
        private int id;
        private String title;
        private String description;
        private String status;
        private String assignedTo;
        private LocalDateTime dueDate;
        private LocalDateTime createdAt;

        public TaskBuilder setId(int id) {
            this.id = id;
            return this;
        }

        public TaskBuilder setTitle(String title) {
            this.title = title;
            return this;
        }

        public TaskBuilder setDescription(String description) {
            this.description = description;
            return this;
        }

        public TaskBuilder setStatus(String status) {
            this.status = status;
            return this;
        }

        public TaskBuilder setAssignedTo(String assignedTo) {
            this.assignedTo = assignedTo;
            return this;
        }

        public TaskBuilder setDueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public TaskBuilder setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Task build() {
            return new Task(this);
        }
    }
}

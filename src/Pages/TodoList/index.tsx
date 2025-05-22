import React, { useState } from "react";
import { Input, Button, List, Checkbox, Typography, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      message.warning("Please enter a task");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <Title level={3}>To-Do List</Title>

      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder="Add a task"
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={addTask}
        />
        <Button type="primary" onClick={addTask}>
          Add
        </Button>
      </Space.Compact>

      <List
        style={{ marginTop: 20 }}
        dataSource={tasks}
        renderItem={task => (
          <List.Item
            actions={[
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => deleteTask(task.id)}
              />
            ]}
          >
            <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)}>
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.text}
              </span>
            </Checkbox>
          </List.Item>
        )}
        locale={{ emptyText: "No tasks yet" }}
      />
    </div>
  );
};

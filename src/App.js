import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      const data = await response.data;
      setTodos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
        title: newTodo,
        userId: 1,
        completed: false,
      });
      const createdTodo = response.data;
      setTodos([...todos, createdTodo]);
      setNewTodo('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleEdit = async (id, updatedTitle) => {
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        title: updatedTitle,
      });
      const updatedTodo = response.data;
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      setEditTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleCreate}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {editTodo === todo.id ? (
              <>
                <input
                  type="text"
                  value={todo.title}
                  onChange={(e) =>
                    setTodos((prevTodos) =>
                      prevTodos.map((t) =>
                        t.id === todo.id ? { ...t, title: e.target.value } : t
                      )
                    )
                  }
                />
                <button onClick={() => handleEdit(todo.id, todo.title)}>Save</button>
              </>
            ) : (
              <>
                <span>{todo.title}</span>
                <button onClick={() => handleEdit(todo.id, todo.title)}>Edit</button>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


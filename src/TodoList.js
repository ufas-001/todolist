import React, { useState, useEffect } from 'react';
import baseURL from './api';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editText, setEditText] = useState('');
  const [editId, setEditId] = useState('');


  useEffect(() => {
    fetch(`${baseURL}/api/todos`)
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  const handleAddTodo = () => {
    if (editId === '') {
      // Adding a new todo
      if (text.trim()) {
        fetch(`${baseURL}/api/todos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })
          .then((response) => response.json())
          .then((data) => {
            setTodos([...todos, data]);
            setText('');
          })
          .catch((error) => console.error('Error creating todo:', error));
      }
    } else {
      // Updating an existing todo
      if (editText.trim()) {
        fetch(`${baseURL}/api/todos/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: editText }),
        })
          .then((response) => response.json())
          .then((data) => {
            const updatedTodos = todos.map((todo) => {
              if (todo._id === editId) {
                return data;
              }
              return todo;
            });
            setTodos(updatedTodos);
            setEditText('');
            setEditId('');
          })
          .catch((error) => console.error('Error updating todo:', error));
      }
    }
  };  

  const handleDeleteTodo = (id) => {
    fetch(`${baseURL}/api/todos/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((error) => console.error('Error deleting todo:', error));
  };

  const handleEditTodo = (id, text) => {
    setEditText(text);
    setEditId(id);
  };  

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={editId === '' ? text : editText}
          onChange={(e) => (editId === '' ? setText(e.target.value) : setEditText(e.target.value))}
          placeholder="Enter a todo"
        />
        <button onClick={handleAddTodo}>{editId === '' ? 'Add Todo' : 'Update Todo'}</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.text}
            <div>
              <button className="edit-button" onClick={() => handleEditTodo(todo._id, todo.text)}>
                Edit
              </button>
              <button className="delete-button" onClick={() => handleDeleteTodo(todo._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;

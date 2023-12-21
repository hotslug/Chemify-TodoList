import { Button, Card, Checkbox, Group, Loader, Text, TextInput, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import logo from './assets/chemify_logo.svg'; // Update the path to your SVG
import classes from './styles/All.module.css';

import { Todo } from "./types";



const App: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [value, onChange] = useState(true);

  const { data: todos = [], isLoading, isError, refetch } = useQuery<Todo[]>(
    'todos',
    async () => {
      const response = await axios.get<{ data: Todo[] }>('http://localhost:8080/todos');
      return response.data.data;
    }
  );

  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      await axios.post('http://localhost:8080/todos', { title: newTodo, done: false });
      setNewTodo('');
      refetch(); // Refresh todos after adding a new one
    }
  };

  const removeTodo = async (id: string) => {
    await axios.delete(`http://localhost:8080/todos/${id}`);
    refetch(); // Refresh todos after deletion
  };

  const toggleCompletion = async (id: string, completed: boolean) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
    if (!updatedTodo) return;

    await axios.put(`http://localhost:8080/todos/${id}`, {
      title: updatedTodo.title,
      done: !completed,
    });
    refetch(); // Refresh todos after toggling completion
  };


  if (isLoading) return <div><Loader color="blue" size="xl" /></div>;
  if (isError) return <div>Error fetching todos</div>;

  const pending = todos.filter((todo) => todo.done === false).length;
  const total = todos.length;
  const done = todos.filter((todo) => todo.done === true).length;

  return (
    <Card padding="xl" shadow="xl" radius="md" style={{ maxWidth: 800, margin: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1, marginRight: 40 }}>
          <Text fw={700} style={{
            marginBottom: 20, fontSize: 50, fontFamily: "Rokkitt", color: 'rgb(107, 122, 131)'
          }}>
            Todoify
          </Text>
          <Group>
            <div style={{ display: 'flex' }}>
              <TextInput
                label="Add a Todo"
                placeholder="ex.Wash your cat."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                style={{ marginRight: 10, fontSize: '16px', width: 280, marginLeft: 5 }}
                classNames={classes}
              />
              <Button disabled={newTodo === '' ? true : false} onClick={addTodo} style={{ height: 55 }}>Add</Button>
            </div>
            <div style={{ height: 500, width: 350, overflow: 'scroll' }}>

              {todos.map((todo) => (
                <Card
                  key={todo.id}
                  padding="sm"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <UnstyledButton style={{ width: 327, marginBottom: 5 }} onClick={() => onChange(!value)} className={classes.button}>
                    <Checkbox
                      checked={todo.done}
                      onChange={() => toggleCompletion(todo.id || '', todo.done || false)}
                      tabIndex={-1}
                      size="md"
                      mr="xl"
                      styles={{ input: { cursor: 'pointer' } }}
                      aria-hidden
                      color="purple"
                    />
                    <div>
                      <Text fw={500} mb={7} lh={1} td={todo.done ? "line-through" : undefined}>
                        {todo.title}
                      </Text>
                      <Text fz="sm" c={todo.done ? "rgb(107, 183, 209)" : "dimmed"}>
                        {todo.done ? "Done" : "Pending"}
                      </Text>
                    </div>
                  </UnstyledButton>
                  <Button onClick={() => removeTodo(todo.id || '')} variant="filled" color="red">
                    <IconTrash size={18} strokeWidth={2} />
                  </Button>
                </Card>
              ))}
            </div>
          </Group>
        </div>

        {/* Right side with gradient and logo */}
        <div style={{ flex: 1, borderLeft: '1px solid rgb(229, 228, 226)', justifyContent: 'center', alignItems: 'center' }}>
          {/* Your SVG logo */}
          <img src={logo} alt="Logo" style={{ maxWidth: '75%', height: 'auto', marginLeft: 50, marginBottom: 40 }} />
          <Text ta="left" style={{
            fontFamily: "Mulish", fontSize: 12, width: 250, marginLeft: 60, marginBottom: 40  }}>
            Lorem irure enim lorem est ullamco voluptate veniam mollit officia dolore esse. Laborum irure ex sint ex eu anim culpa consectetur voluptate pariatur enim officia amet aute velit fugiat aute sint sint. Cillum ex occaecat qui cupidatat do consequat laboris sed cillum ea cillum fugiat officia minim.
            <br /><br />
            Labore labore veniam incididunt cillum in occaecat ad lorem aliquip qui proident sit sunt quis. Aliquip ex ut eu sint commodo officia ea voluptate aliquip duis ipsum elit. Aliqua consequat fugiat veniam ad occaecat mollit anim duis exercitation do eu veniam. Consectetur magna magna magna veniam cupidatat commodo esse officia occaecat consectetur aliqua do enim.
          </Text>
          <Text ta="center" style={{ fontFamily: "Mulish", fontSize: 15 }}>
            Total Todos: <span style={{ fontSize: 25, fontFamily: 'Rokkitt', color: 'rgb(194, 60, 118)'}}>{total}</span>
          </Text>
          <Text ta="center" style={{ fontFamily: "Mulish", fontSize: 15 }}>
            Total Completed: <span style={{ fontSize: 25, fontFamily: 'Rokkitt', color: 'rgb(194, 60, 118)' }}>{done}</span>
          </Text>
          <Text ta="center" style={{ fontFamily: "Mulish", fontSize: 15 }}>
            Total Pending: <span style={{ fontSize: 25, fontFamily: 'Rokkitt', color: 'rgb(194, 60, 118)' }}>{pending}</span>
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default App;

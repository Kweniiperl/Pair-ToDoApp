import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);

  const addTask = () => {
    if (task.trim().length === 0) {
      Alert.alert('Error', 'Task cannot be empty');
      return;
    }
    if (tasks.some(t => t.task === task.trim())) {
      Alert.alert('Error', 'Task already exists');
      return;
    }
    setTasks([...tasks, { key: Math.random().toString(), task: task.trim(), completed: false }]);
    setTask('');
  };

  const startEditing = (taskKey, taskText) => {
    setTask(taskText);
    setEditTaskId(taskKey);
  };

  const saveEditTask = () => {
    setTasks(tasks.map(item => 
      item.key === editTaskId ? { ...item, task: task.trim() } : item
    ));
    setTask('');
    setEditTaskId(null);
  };

  const cancelEdit = () => {
    setTask('');
    setEditTaskId(null);
  };

  const toggleCompleteTask = (taskKey) => {
    setTasks(tasks.map(item => 
      item.key === taskKey ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeTask = (taskKey) => {
    setTasks(tasks.filter(item => item.key !== taskKey));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const filteredTasks = tasks.filter(item => 
    item.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ToDo List</Text>

      <TextInput
        placeholder="SEARCH TASKS"
        style={styles.searchInput}
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />

      <TextInput
        placeholder={editTaskId ? "EDIT TASK" : "ADD NEW TASK"}
        style={styles.input}
        onChangeText={(text) => setTask(text)}
        value={task}
      />

      <View style={styles.buttonContainer}>
        {editTaskId ? (
          <>
            <Button title="SAVE EDIT" onPress={saveEditTask} />
            <Button title="CANCEL" color="gray" onPress={cancelEdit} />
          </>
        ) : (
          <>
            <Button title="ADD TASK" onPress={addTask} />
            <Button title="CLEAR ALL" color="red" onPress={clearAllTasks} />
          </>
        )}
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleCompleteTask(item.key)} onLongPress={() => startEditing(item.key, item.task)}>
            <View style={styles.taskItem}>
              <Text style={item.completed ? styles.completedTask : styles.taskText}>
                {item.task}
              </Text>
              <TouchableOpacity onPress={() => removeTask(item.key)}>
                <Text style={styles.deleteButton}>❌</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.key}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    marginBottom: 15, 
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    fontSize: 16,
    color: 'red',
  },
});

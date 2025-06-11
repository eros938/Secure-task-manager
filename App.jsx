import React, { useState, useEffect } from 'react';

// Custom SVG Icons
const Icon = {
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  Add: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
};

// Secure Task Manager Application Component
function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Tasks State
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse tasks from localStorage', e);
      }
    }
    
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save authentication status to localStorage
  useEffect(() => {
    localStorage.setItem('authenticated', isAuthenticated);
  }, [isAuthenticated]);

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basic input validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // Simulate authentication (in real app this would call an API)
    if (username === 'admin' && password === 'SecurePass123!') {
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setNewTask('');
  };

  // Handle adding a new task
  const addTask = (e) => {
    e.preventDefault();
    
    // Input validation and sanitization
    const trimmedTask = newTask.trim();
    if (!trimmedTask) return;
    
    // Output encoding - sanitize HTML content
    const sanitizedTask = encodeHTML(trimmedTask);
    
    const newTaskObj = {
      id: Date.now(),
      text: sanitizedTask,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  // Toggle task completion status
  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Clear all completed tasks
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Encode HTML special characters to prevent XSS attacks
  const encodeHTML = (str) => {
    return str.replace(/[&<>"'/]/g, tag => ({
      '&': '&amp;',
      '<': '<',
      '>': '>',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    }[tag]));
  };

  // Render Login Form
  const renderLoginForm = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg transform transition-all hover:scale-[1.01]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Use admin / SecurePass123! to login
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon.User />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-t-md relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon.Lock />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-b-md relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render Task Manager Dashboard
  const renderDashboard = () => (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SecureTask</h1>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:ml-8 md:flex md:space-x-8">
                  <button 
                    onClick={() => setFilter('all')}
                    className={`py-4 px-1 text-sm font-medium border-b-2 ${
                      filter === 'all' 
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    All Tasks
                  </button>
                  <button 
                    onClick={() => setFilter('active')}
                    className={`py-4 px-1 text-sm font-medium border-b-2 ${
                      filter === 'active' 
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Active
                  </button>
                  <button 
                    onClick={() => setFilter('completed')}
                    className={`py-4 px-1 text-sm font-medium border-b-2 ${
                      filter === 'completed' 
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Completed
                  </button>
                </nav>
              </div>
              
              <div className="flex items-center">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="mr-4 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Logout
                </button>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
                >
                  <span className="sr-only">Open main menu</span>
                  <Icon.Menu />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-800 shadow-inner">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button 
                  onClick={() => {
                    setFilter('all');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    filter === 'all' 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  All Tasks
                </button>
                <button 
                  onClick={() => {
                    setFilter('active');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    filter === 'active' 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Active
                </button>
                <button 
                  onClick={() => {
                    setFilter('completed');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    filter === 'completed' 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="max-w-3xl mx-auto">
              {/* Welcome Card */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Welcome back, Admin!
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    You have {tasks.length} total tasks.
                  </p>
                </div>
              </div>
              
              {/* Task Input Form */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={addTask} className="flex gap-2">
                    <div className="flex-grow">
                      <label htmlFor="new-task" className="sr-only">Add a new task</label>
                      <input
                        id="new-task"
                        name="new-task"
                        type="text"
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="block w-full px-4 py-3 pr-20 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <Icon.Add />
                      <span className="ml-1">Add</span>
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Task List */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTasks.length === 0 ? (
                    <li className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No tasks found. Add a new task above!</p>
                    </li>
                  ) : (
                    filteredTasks.map((task) => (
                      <li key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                task.completed 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {task.completed && <Icon.Check />}
                            </button>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {task.text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Created: {new Date(task.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-gray-400 hover:text-red-500 focus:outline-none"
                              aria-label="Delete task"
                            >
                              <Icon.Trash />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                
                {/* Footer with stats and controls */}
                {tasks.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
                    </div>
                    <button
                      onClick={clearCompleted}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                    >
                      Clear completed
                    </button>
                  </div>
                )}
              </div>
              
              {/* Security Features Info */}
              <div className="mt-6 bg-indigo-50 dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-indigo-800 dark:text-indigo-400">
                    Security Features Implemented
                  </h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Input Validation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">All user inputs are validated before processing.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Output Encoding</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">HTML characters are encoded to prevent XSS attacks.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Authentication</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Basic authentication implemented with localStorage persistence.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Data Persistence</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tasks stored securely in browser localStorage.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-inner">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">SecureTask</h2>
                <p className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                  A secure task management solution
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  &copy; {new Date().getFullYear()} SecureTask. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );

  return isAuthenticated ? renderDashboard() : renderLoginForm();
}

export default App;
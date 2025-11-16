# Mastering React Hooks

React Hooks revolutionized the way we write React components by allowing us to **use state and other React features in functional components**. Introduced in React 16.8, Hooks have become the standard way to build React applications.

## Why React Hooks?

Hooks solve several problems that existed with class components:

- **Reusable stateful logic** - Share logic between components without HOCs or render props
- **Simpler code** - No need for class syntax, `this` keyword, or lifecycle methods
- **Better code organization** - Group related logic together instead of splitting across lifecycle methods
- **Smaller bundle size** - Functional components are more lightweight
- **Easier testing** - Pure functions are simpler to test

## The Rules of Hooks

> **Critical**: Always follow these two rules when using Hooks!

1. **Only call Hooks at the top level** - Don't call Hooks inside loops, conditions, or nested functions
2. **Only call Hooks from React functions** - Call them from functional components or custom Hooks

```typescript
// ❌ Bad - Hook inside condition
function BadComponent() {
  if (condition) {
    const [state, setState] = useState(0); // Wrong!
  }
}

// ✅ Good - Hook at top level
function GoodComponent() {
  const [state, setState] = useState(0);
  
  if (condition) {
    // Use the state here
  }
}
```

## Essential Hooks

### useState

The most commonly used Hook for managing component state:

```typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Alice");
  
  // With objects
  const [user, setUser] = useState({
    name: "Bob",
    age: 30
  });
  
  const incrementCount = () => {
    setCount(count + 1);
    // Or use functional update for correct async behavior
    setCount(prev => prev + 1);
  };
  
  const updateUser = () => {
    setUser(prev => ({
      ...prev,
      age: prev.age + 1
    }));
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment</button>
    </div>
  );
}
```

### useEffect

Handle side effects like data fetching, subscriptions, or DOM manipulation:

```typescript
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This runs after every render (without dependency array)
    console.log('Component rendered');
  });
  
  useEffect(() => {
    // This runs only once (empty dependency array)
    console.log('Component mounted');
    
    return () => {
      // Cleanup function runs on unmount
      console.log('Component unmounted');
    };
  }, []);
  
  useEffect(() => {
    // This runs when userId changes
    setLoading(true);
    
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
    
    // Cleanup: cancel requests on userId change
    return () => {
      // Cancel fetch request
    };
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{user?.name}</div>;
}
```

### useContext

Access context values without prop drilling:

```typescript
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext<'light' | 'dark'>('light');

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Header />
      <Main />
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  
  return (
    <header className={theme === 'dark' ? 'dark-header' : 'light-header'}>
      <h1>My App</h1>
    </header>
  );
}
```

## Performance Hooks

### useMemo

Memoize expensive calculations:

```typescript
import { useMemo, useState } from 'react';

function ExpensiveComponent({ items }: { items: number[] }) {
  const [count, setCount] = useState(0);
  
  // Without useMemo - recalculates on every render
  const sum = items.reduce((a, b) => a + b, 0);
  
  // With useMemo - only recalculates when items change
  const memoizedSum = useMemo(() => {
    console.log('Calculating sum...');
    return items.reduce((a, b) => a + b, 0);
  }, [items]);
  
  return (
    <div>
      <p>Sum: {memoizedSum}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
    </div>
  );
}
```

### useCallback

Memoize functions to prevent unnecessary re-renders:

```typescript
import { useCallback, useState, memo } from 'react';

// Child component wrapped in memo
const ChildComponent = memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);
  
  // Without useCallback - new function on every render
  const handleClick = () => {
    console.log('Clicked!');
  };
  
  // With useCallback - same function reference
  const memoizedHandleClick = useCallback(() => {
    console.log('Clicked!');
    setCount(prev => prev + 1);
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Other: {other}</p>
      <ChildComponent onClick={memoizedHandleClick} />
      <button onClick={() => setOther(other + 1)}>
        Update Other
      </button>
    </div>
  );
}
```

### useRef

Access DOM elements or persist values without causing re-renders:

```typescript
import { useRef, useEffect } from 'react';

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);
  
  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
    // Track renders without causing re-renders
    renderCount.current += 1;
  });
  
  const handleClick = () => {
    // Access DOM element
    inputRef.current?.select();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Select Text</button>
      <p>Render count: {renderCount.current}</p>
    </div>
  );
}
```

## Advanced Hooks

### useReducer

Manage complex state logic with a reducer pattern:

```typescript
import { useReducer } from 'react';

type State = {
  count: number;
  error: string | null;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'error'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1, error: null };
    case 'decrement':
      if (state.count === 0) {
        return { ...state, error: 'Cannot go below zero' };
      }
      return { ...state, count: state.count - 1, error: null };
    case 'reset':
      return { count: 0, error: null };
    case 'error':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### useLayoutEffect

Similar to useEffect but fires synchronously after DOM mutations:

```typescript
import { useLayoutEffect, useRef, useState } from 'react';

function AnimatedComponent() {
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  
  useLayoutEffect(() => {
    // Measure DOM before browser paints
    if (divRef.current) {
      setHeight(divRef.current.getBoundingClientRect().height);
    }
  }, []);
  
  return (
    <div ref={divRef}>
      <p>Height: {height}px</p>
    </div>
  );
}
```

### useImperativeHandle

Customize the instance value exposed to parent components:

```typescript
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface CustomInputHandle {
  focus: () => void;
  clear: () => void;
}

const CustomInput = forwardRef<CustomInputHandle>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }));
  
  return <input ref={inputRef} type="text" />;
});

function Parent() {
  const inputRef = useRef<CustomInputHandle>(null);
  
  return (
    <div>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.clear()}>Clear</button>
    </div>
  );
}
```

## Custom Hooks

Create reusable logic by extracting it into custom Hooks:

### useLocalStorage

```typescript
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);
  
  return [value, setValue] as const;
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');
  
  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

### useFetch

```typescript
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const response = await fetch(url);
        const data = await response.json();
        
        if (mounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (mounted) {
          setState({ data: null, loading: false, error: error as Error });
        }
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [url]);
  
  return state;
}

// Usage
function UserList() {
  const { data, loading, error } = useFetch<User[]>('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### useDebounce

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Make API call
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### useToggle

```typescript
import { useState, useCallback } from 'react';

function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  return [value, toggle] as const;
}

// Usage
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  
  return (
    <div>
      <button onClick={toggleOpen}>
        {isOpen ? 'Close' : 'Open'} Modal
      </button>
      {isOpen && <div className="modal">Modal Content</div>}
    </div>
  );
}
```

## Common Patterns

### Fetching Data on Mount

```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setLoading(false);
        }
      }
    }
    
    fetchUser();
    
    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

### Form Handling

```typescript
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Previous Value Tracking

```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Best Practices

| Practice | Description | Example |
|----------|-------------|---------|
| **Dependency arrays** | Always include all dependencies | `useEffect(() => {...}, [dep1, dep2])` |
| **Cleanup functions** | Return cleanup from useEffect | `return () => clearInterval(id)` |
| **Functional updates** | Use functions for state updates | `setState(prev => prev + 1)` |
| **Extract custom hooks** | Reuse logic across components | `const data = useFetch(url)` |
| **Avoid inline objects** | Memoize objects in dependencies | `useMemo(() => ({...}), [])` |

> **Pro Tip**: Use the ESLint plugin `eslint-plugin-react-hooks` to catch Hook mistakes automatically!

## Common Mistakes

### 1. Missing Dependencies

```typescript
// ❌ Bad - missing dependency
useEffect(() => {
  console.log(count);
}, []);

// ✅ Good - include all dependencies
useEffect(() => {
  console.log(count);
}, [count]);
```

### 2. Stale Closures

```typescript
// ❌ Bad - stale closure
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1); // Uses stale count
  }, 1000);
  return () => clearInterval(interval);
}, []);

// ✅ Good - functional update
useEffect(() => {
  const interval = setInterval(() => {
    setCount(prev => prev + 1); // Always fresh
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

### 3. Unnecessary Dependencies

```typescript
// ❌ Bad - object recreated on every render
const options = { method: 'GET' };

useEffect(() => {
  fetch(url, options);
}, [url, options]); // options changes every render!

// ✅ Good - memoize the object
const options = useMemo(() => ({ method: 'GET' }), []);

useEffect(() => {
  fetch(url, options);
}, [url, options]);
```

## Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
}

test('useCounter increments count', () => {
  const { result } = renderHook(() => useCounter(0));
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Hooks API Reference](https://react.dev/reference/react/hooks)
- [React Hooks FAQ](https://react.dev/learn#adding-interactivity)
- [useHooks.com](https://usehooks.com/) - Collection of custom Hooks
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Conclusion

React Hooks have transformed how we build React applications, making code more reusable, testable, and maintainable. By mastering the built-in Hooks and creating custom ones, you can write cleaner, more efficient React code.

**Start using Hooks today** and experience the power of functional components with state and side effects!

---

*Last updated: November 2025*  
*Written by: Harsh*  
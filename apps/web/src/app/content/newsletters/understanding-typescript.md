# Understanding TypeScript

TypeScript is a **statically typed superset of JavaScript** that compiles to plain JavaScript. Developed and maintained by Microsoft, it has become the go-to choice for building robust, scalable applications.

## Why TypeScript?

TypeScript addresses JavaScript's limitations and brings several powerful features:

- **Static type checking** - Catch errors before runtime
- **Enhanced IDE support** - Better autocomplete and refactoring
- **Modern JavaScript features** - Use ES6+ features with backward compatibility
- **Better code documentation** - Types serve as inline documentation
- **Improved maintainability** - Easier to refactor large codebases

## Getting Started

### Installation

Install TypeScript globally or in your project:

```bash
# Global installation
npm install -g typescript

# Project installation
npm install --save-dev typescript

# Initialize TypeScript config
tsc --init
```

### Your First TypeScript File

Create a `hello.ts` file:

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const message = greet("TypeScript");
console.log(message);
```

Compile and run:

```bash
tsc hello.ts
node hello.js
```

### Type Annotations

```typescript
// Variables
let username: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Objects
let user: { name: string; age: number } = {
  name: "Bob",
  age: 25
};

// Functions
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;
```

## Interfaces and Types

### Interfaces

Interfaces define the structure of objects:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Read-only
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()
};

// Extending interfaces
interface Admin extends User {
  role: string;
  permissions: string[];
}
```

### Type Aliases

Type aliases create custom types:

```typescript
type ID = string | number;
type Status = "pending" | "approved" | "rejected";

type Product = {
  id: ID;
  name: string;
  price: number;
  status: Status;
};

// Union types
type Result = Success | Error;

// Intersection types
type Employee = Person & { employeeId: number };
```

## Advanced Types

### Generics

Generics create reusable, type-safe components:

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic class
class DataStore<T> {
  private data: T[] = [];
  
  add(item: T): void {
    this.data.push(item);
  }
  
  get(index: number): T {
    return this.data[index];
  }
}
```

### Union and Intersection Types

```typescript
// Union - can be one of several types
type StringOrNumber = string | number;

function format(value: StringOrNumber): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// Intersection - combines multiple types
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged;

const person: Person = {
  name: "Alice",
  age: 30
};
```

### Utility Types

TypeScript provides built-in utility types:

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// Partial - makes all properties optional
type PartialTodo = Partial<Todo>;

// Required - makes all properties required
type RequiredTodo = Required<Todo>;

// Readonly - makes all properties readonly
type ReadonlyTodo = Readonly<Todo>;

// Pick - selects specific properties
type TodoPreview = Pick<Todo, "title" | "completed">;

// Omit - removes specific properties
type TodoInfo = Omit<Todo, "completed">;

// Record - creates object type with specific keys
type UserRoles = Record<string, string[]>;
```

## Classes and OOP

TypeScript enhances classes with type safety:

```typescript
class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  public move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`);
  }
}

class Dog extends Animal {
  private breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  bark(): void {
    console.log("Woof! Woof!");
  }
}

// Abstract classes
abstract class Shape {
  abstract area(): number;
  
  describe(): void {
    console.log(`Area: ${this.area()}`);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

## Type Guards and Narrowing

> **Pro Tip**: Type guards help TypeScript understand types in conditional blocks.

```typescript
// typeof guard
function process(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows it's a string
  }
  return value.toFixed(2); // TypeScript knows it's a number
}

// instanceof guard
class Cat { meow() {} }
class Dog { bark() {} }

function makeSound(animal: Cat | Dog) {
  if (animal instanceof Cat) {
    animal.meow();
  } else {
    animal.bark();
  }
}

// Custom type guard
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## Enums

Enums define a set of named constants:

```typescript
// Numeric enum
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

// String enum
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING"
}

// Using enums
let currentDirection: Direction = Direction.Up;
let userStatus: Status = Status.Active;

// Const enum (optimized)
const enum Colors {
  Red,
  Green,
  Blue
}
```

## Modules and Namespaces

### ES6 Modules

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

// app.ts
import { add, PI } from "./math";

console.log(add(2, 3));
console.log(PI);
```

### Namespaces

```typescript
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }
  
  export class EmailValidator implements StringValidator {
    isValid(email: string): boolean {
      return email.includes("@");
    }
  }
}

const validator = new Validation.EmailValidator();
```

## Configuration

### tsconfig.json

Key compiler options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

## Best Practices

1. **Enable strict mode** - Use `"strict": true` in tsconfig.json
2. **Avoid `any`** - Use `unknown` or specific types instead
3. **Use interfaces for objects** - More extensible than type aliases
4. **Leverage type inference** - Let TypeScript infer types when possible
5. **Write small, focused types** - Easier to maintain and reuse

```typescript
// ❌ Bad
function process(data: any) {
  return data.value;
}

// ✅ Good
interface Data {
  value: string;
}

function process(data: Data): string {
  return data.value;
}
```

## Common Patterns

### Discriminated Unions
```typescript
interface Success<T = unknown> {
  type: "success";
  data: T;
}

interface Failure {
  type: "failure";
  error: string;
}

type Result<T = unknown> = Success<T> | Failure;

function handleResult(result: Result) {
  if (result.type === "success") {
    console.log(result.data);
  } else {
    console.error(result.error);
  }
}
```

### Mapped Types

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
type OptionalUser = Optional<User>;
```

## TypeScript with React

```typescript
import React, { useState } from 'react';

interface Props {
  name: string;
  age?: number;
  onClick: (id: number) => void;
}

const UserCard: React.FC<Props> = ({ name, age, onClick }) => {
  const [count, setCount] = useState<number>(0);
  
  return (
    <div onClick={() => onClick(count)}>
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
};
```

## Resources

- [Official TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) - Type definitions for JavaScript libraries
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

---

## Conclusion

TypeScript transforms JavaScript development by adding type safety, better tooling, and enhanced code quality. While there's a learning curve, the benefits of catching errors early and having better IDE support make it worthwhile for projects of any size.

**Ready to level up your JavaScript?** Start using TypeScript today and experience the difference!

---

*Last updated: November 2025*  
*Written by: Harsh*  
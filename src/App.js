import React from "react";
import { MyComponent } from "./component"; // Assuming MyComponent.js is in the same directory
import { TodoList } from "./component_cloning";

function App() {
  return (
    <div className="App">
      <h1>Drag and Drop</h1>
      <TodoList />
    </div>
  );
}

export default App;
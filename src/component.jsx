import React, { useState } from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import "./component.css";

export function MyComponent() {
  // Define items and formArea
  const initialItems = [
    "Text",
    "Text Area",
    "Number",
    "Date",
    "Hour",
    "Dropdown",
    "Multiple Option"
  ];
  const [items, setItems] = useState(initialItems);
  const [formArea, setFormArea] = useState([]);

  // Hook for items list
  const [itemsList, itemsArray, updateItems] = useDragAndDrop(items, {
    group: "todoList",
    dragHandle: ".kanban-handle"
  });

  // Hook for formArea list
  const [formAreaList, formAreaArray, updateFormArea] = useDragAndDrop(formArea, {
    group: "todoList",
    dragHandle: ".kanban-handle"
  });

  // Handle dropping items into formArea
  const handleDropItems = (event) => {
    const itemText = event.dataTransfer.getData("text/plain");
    if (itemText) {
      const newFormArea = [...formArea, itemText];
      setFormArea(newFormArea);
      updateFormArea(newFormArea);
    }
  };

  return (
    <div className="kanban-board">
      {/* Items list */}
      <div className="item-list">
        <ul
          ref={itemsList}
          className="kanban-column"
          onDrop={handleDropItems}
          onDragOver={(event) => event.preventDefault()}
        >
          {itemsArray.map((item) => (
            <li className="kanban-item" key={item}>
              <span className="kanban-handle"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Form Area list */}
      <div className="form-area">
        <ul
          ref={formAreaList}
          className="kanban-column"
          onDragOver={(event) => event.preventDefault()}
        >
          {formAreaArray.map((formItem) => (
            <li className="kanban-item" key={formItem}>
              <span className="kanban-handle"></span>
              {formItem}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

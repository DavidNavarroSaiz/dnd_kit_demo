import React, { useState } from 'react';
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import {
  parents,
  parentValues,
  dragValues,
  setParentValues,
} from "@formkit/drag-and-drop";

export function TodoList() {
  // Functions and plugins
  const sourceTransfer = (state, data) => {
    const draggedValues = dragValues(state);

    const lastParentValues = parentValues(
      state.lastParent.el,
      state.lastParent.data
    ).filter((x) => !draggedValues.includes(x));

    setParentValues(state.lastParent.el, state.lastParent.data, lastParentValues);
  };

  const findDuplicates = (values) => {
    const uniqueElements = new Set();
    const duplicates = [];

    values.forEach((item) => {
      if (uniqueElements.has(item)) {
        duplicates.push(item);
      } else {
        uniqueElements.add(item);
      }
    });

    return duplicates;
  };

  const targetTransfer = (state, data) => {
    const draggedValues = dragValues(state);

    const targetParentValues = parentValues(
      data.targetData.parent.el,
      data.targetData.parent.data
    );

    const reset =
      state.initialParent.el === data.targetData.parent.el &&
      data.targetData.parent.data.config.sortable === false;

    let targetIndex;

    if ("node" in data.targetData) {
      if (reset) {
        targetIndex = state.initialIndex;
      } else if (data.targetData.parent.data.config.sortable === false) {
        targetIndex = data.targetData.parent.data.enabledNodes.length;
      } else {
        targetIndex = data.targetData.node.data.index;
      }

      targetParentValues.splice(targetIndex, 0, ...draggedValues);
    } else {
      targetIndex = reset
        ? state.initialIndex
        : data.targetData.parent.data.enabledNodes.length;

      targetParentValues.splice(targetIndex, 0, ...draggedValues);
    }

    const duplicates = findDuplicates(targetParentValues);

    for (const duplicate of duplicates) {
      if (!("key" in duplicate) || typeof duplicate !== "object") continue;
      const index = targetParentValues.indexOf(duplicate);
      const newKey = `${duplicate.key}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;

      targetParentValues[index] = {
        ...targetParentValues[index],
        key: newKey,
      };
    }

    setParentValues(
      data.targetData.parent.el,
      data.targetData.parent.data,
      targetParentValues
    );
  };

  const targetClone = (parent) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      setup() {
        parentData.config.performTransfer = targetTransfer;
      },
    };
  };

  const sourceClone = (parent) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      setup() {
        parentData.config.performTransfer = sourceTransfer;
      },
    };
  };

  // Initial todos and done values
  const [initialTodos] = useState([
    {
      label: "Text",
      key: "text",
    },
    {
      label: "Text Area",
      key: "text-area",
    },
    {
      label: "Number",
      key: "number",
    },
    {
      label: "Date",
      key: "date",
    },
    {
      label: "Hour",
      key: "hour",
    },
    {
      label: "Dropdown",
      key: "dropdown",
    },
    {
      label: "Multiple Option",
      key: "multiple-Option",
    },
  ]);

  const [todoList, todos] = useDragAndDrop(initialTodos, {
    group: "todoList",
    sortable: false,
    plugins: [sourceClone],
  });

  const [doneValues] = useState([
    
  ]);

  const [doneList, dones] = useDragAndDrop(doneValues, {
    group: "todoList",
    plugins: [targetClone],
  });

  return (
    <div>
      <h2>DnD items example</h2>
      <div className="group bg-slate-200 dark:bg-slate-800">
        <div className="kanban-board p-px grid grid-cols-2 gap-px">
          <div className="kanban-column">
            <h2 className="kanban-title">Item List</h2>
            <ul ref={todoList} className="kanban-list">
              {todos.map(todo => (
                <li
                  key={todo.key}
                  className="kanban-item flex items-center"
                >
                  {todo.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="kanban-column">
            <h2 className="kanban-title">Form</h2>
            <ul ref={doneList} className="kanban-list">
              {dones.length === 0 && <li style={{ height: '40px' }}></li>}
              {dones.map(done => (
                <li
                  key={done.key}
                  className="kanban-item kanban-complete flex items-center"
                >
                  <span>{done.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <pre style={{ fontSize: '10px', color: 'white' }}>
            {JSON.stringify(todos, null, 2)}
          </pre>
          <pre style={{ fontSize: '10px', color: 'white' }}>
            {JSON.stringify(dones, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
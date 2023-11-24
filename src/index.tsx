import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { promises as fs } from "fs";
import { join } from "path";
import { useState } from "react";

type Values = {
  textfield: string;
  dropdown: string;
  contextDropdown: string;
};

export default function Command() {
  const [textField, setTextField] = useState('');
  const [dropdown, setDropdown] = useState<string>('');
  const [contextDropdown, setContextDropdown] = useState<string>('');

  async function handleSubmit(values: Values) {
    const todoPath = join("/Users/martinbetz/Notes/Todos", "todo.txt");

    const todoItem = `(${values.dropdown}) ${values.textfield} @${values.contextDropdown}`;

    await fs.appendFile(todoPath, todoItem + "\n");
    showToast({
      title: "Added todo",
      message: "Added todo. See logs for submitted values",
    });

    // Clear the fields by updating the states
    setTextField('');
    setDropdown('');
    setContextDropdown('');
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Add todo" />
      <Form.TextField
        id="textfield"
        title="Text field"
        placeholder="Enter text"
        value={textField}
        onChange={(text) => setTextField(text)}
      />
      <Form.Dropdown
        id="dropdown"
        title="Priority"
        value={dropdown}
        onChange={(value) => setDropdown(value)}
      >
        <Form.Dropdown.Item value="D" title="D" icon="🟢" />
        <Form.Dropdown.Item value="C" title="C" icon="🟡" />
        <Form.Dropdown.Item value="B" title="B" icon="🟠" />
        <Form.Dropdown.Item value="A" title="A" icon="🔴" />
      </Form.Dropdown>
      <Form.Dropdown // Additional dropdown for context
        id="contextDropdown"
        title="Context"
        value={contextDropdown}
        onChange={(value) => setContextDropdown(value)}
      >
        <Form.Dropdown.Item value="kurz" title="Kurz" icon="💨" />
        <Form.Dropdown.Item value="leicht" title="Leicht" icon="🌱" />
        <Form.Dropdown.Item value="routine" title="Routine" icon="🔄" />
        <Form.Dropdown.Item value="deep" title="Deep" icon="🤔" />
        <Form.Dropdown.Item value="austausch" title="Austausch" icon="💬" />
        <Form.Dropdown.Item value="warten" title="Warten" icon="⏳" />
      </Form.Dropdown>
    </Form>
  );
}

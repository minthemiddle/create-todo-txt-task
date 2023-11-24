import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { promises as fs } from "fs";
import { join } from "path";
import { useState } from "react";

type Values = {
  textfield: string;
  dropdown: string;
};

export default function Command() {
  const [textField, setTextField] = useState('');
  const [dropdown, setDropdown] = useState<string>(''); // New state for dropdown

  async function handleSubmit(values: Values) {
    const todoPath = join("/Users/martinbetz/Notes/Todos", "todo.txt");

    const todoItem =
      values.dropdown // Using dropdown value
        ? "(" + values.dropdown + ") " + values.textfield
        : values.textfield;

    await fs.appendFile(todoPath, todoItem + "\n");
    showToast({
      title: "Added todo",
      message: "Added todo. See logs for submitted values",
    });

    // Clear the fields by updating the state
    setTextField('');
    setDropdown('');
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
      <Form.Dropdown // Replace Form.TagPicker with Form.Dropdown
        id="dropdown"
        title="Priority" // Modify the title as needed
        value={dropdown}
        onChange={(value) => setDropdown(value)}
      >
        <Form.Dropdown.Item value="D" title="D" icon="🟢" />
        <Form.Dropdown.Item value="C" title="C" icon="🟡" />
        <Form.Dropdown.Item value="B" title="B" icon="🟠" />
        <Form.Dropdown.Item value="A" title="A" icon="🔴" />
      </Form.Dropdown>
    </Form>
  );
}

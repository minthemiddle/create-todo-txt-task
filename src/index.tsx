import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { promises as fs } from "fs";
import { join } from "path";
import { useState } from "react";

type Values = {
  textfield: string;
  tokeneditor: string[];
};

export default function Command() {
  const [textField, setTextField] = useState('');
  const [tokenEditor, setTokenEditor] = useState<string[]>([]);

  async function handleSubmit(values: Values) {
    const todoPath = join("/Users/martinbetz/Notes/Todos", "todo.txt");
    
    const todoItem =
      values.tokeneditor && values.tokeneditor[0]
        ? "(" + values.tokeneditor[0] + ") " + values.textfield
        : values.textfield;

    await fs.appendFile(todoPath, todoItem + "\n");
    showToast({
      title: "Added todo",
      message: "Added todo. See logs for submitted values",
    });

    // Clear the fields by updating the state
    setTextField('');
    setTokenEditor([]);
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
      <Form.TagPicker
        id="tokeneditor"
        title="Priority"
        values={tokenEditor}
        onChange={(tokens) => setTokenEditor(tokens)}
      >
        <Form.TagPicker.Item value="A" title="A" />
        <Form.TagPicker.Item value="B" title="B" />
        <Form.TagPicker.Item value="C" title="C" />
        <Form.TagPicker.Item value="D" title="D" />
      </Form.TagPicker>
    </Form>
  );
}

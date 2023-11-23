import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { promises as fs } from "fs";
import { join } from "path";


type Values = {
  textfield: string;
  tokeneditor: string[];
};

export default function Command() {
 async function handleSubmit(values: Values) {
   const todoPath = join("/Users/martinbetz/Notes/Todos", "todo.txt");
   await fs.appendFile(todoPath, values.textfield + "\n");
   showToast({ title: "Added todo", message: "Added todo. See logs for submitted values" });
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
      <Form.TextField id="textfield" title="Text field" placeholder="Enter text" defaultValue="" />
      <Form.TagPicker id="tokeneditor" title="Priority">
        <Form.TagPicker.Item value="A" title="A" />
        <Form.TagPicker.Item value="B" title="B" />
      </Form.TagPicker>
    </Form>
  );
}
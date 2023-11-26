import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { promises as fs, readdir, readFile } from "fs";
import { join } from "path";
import { useState, useEffect } from "react";
import { readdir, readFile } from "fs/promises";

type Values = {
  textfield: string;
  areaDropdown: string;
  dropdown: string;
  contextDropdown: string;
  projectDropdown: string;
};

export default function Command() {
  const [textField, setTextField] = useState('');
  const [areaDropdown, setAreaDropdown] = useState<string>('');
  const [dropdown, setDropdown] = useState<string>('');
  const [contextDropdown, setContextDropdown] = useState<string>('');
  const [projectDropdown, setProjectDropdown] = useState<string>('');
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
  async function fetchProjects() {
  try {
    const basePath = "/Users/martinbetz/Notes/Todos/";
    const files = await readdir(basePath, { withFileTypes: true });

    const projectNames: string[] = [];
    for (const file of files) {
      if (file.isFile()) {
        const filePath = join(basePath, file.name);
        const fileContent = await readFile(filePath, "utf-8");

        const lines = fileContent.split("\n");

        lines.forEach((line) => {
          const matches = line.match(/\+([\p{L}\d_-]+)/gu);
          if (matches) {
            matches.forEach((match) => {
              try {
                const projectName = match.substring(1); // Remove the '+' symbol
                if (!projectNames.includes(projectName)) {
                  projectNames.push(projectName);
                }
              } catch (error) {
                console.error("Error parsing project name:", error);
              }
            });
          }
        });
      }
    }

    setProjects(projectNames);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}






    fetchProjects();
  }, []);

  async function handleSubmit(values: Values) {
    const basePath = "/Users/martinbetz/Notes/Todos/";

    const areaFilePaths: Record<string, string> = {
      pool: "pool.txt",
      todo: "todo.txt",
      work: "work.txt",
    };

    const todoPath = join(basePath, areaFilePaths[values.areaDropdown]);

    const todoItem = values.projectDropdown === "" 
    ? `(${values.dropdown}) ${values.textfield} @${values.contextDropdown}` 
    : `(${values.dropdown}) ${values.textfield} @${values.contextDropdown} +${values.projectDropdown}`;

    await fs.appendFile(todoPath, todoItem + "\n");
    showToast({
      title: "Added todo",
      message: "Added todo. See logs for submitted values",
    });

    setTextField('');
    setAreaDropdown('');
    setDropdown('');
    setContextDropdown('');
    setProjectDropdown('');
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
        id="areaDropdown"
        title="Area"
        value={areaDropdown}
        onChange={(value) => setAreaDropdown(value)}
      >
        <Form.Dropdown.Item value="pool" title="Pool" icon="🏊‍♂️" />
        <Form.Dropdown.Item value="todo" title="Todo" icon="📝" />
        <Form.Dropdown.Item value="work" title="Work" icon="💼" />
        {/* Add more areas here... */}
      </Form.Dropdown>
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
      <Form.Dropdown
        id="contextDropdown"
        title="Context"
        value={contextDropdown}
        onChange={(value) => setContextDropdown(value)}
      >
        <Form.Dropdown.Item value="neu" title="Neu" icon="🌟" />
        <Form.Dropdown.Item value="kurz" title="Kurz" icon="💨" />
        <Form.Dropdown.Item value="leicht" title="Leicht" icon="🌱" />
        <Form.Dropdown.Item value="routine" title="Routine" icon="🔄" />
        <Form.Dropdown.Item value="deep" title="Deep" icon="🤔" />
        <Form.Dropdown.Item value="sozial" title="Sozial" icon="💬" />
        <Form.Dropdown.Item value="warten" title="Warten" icon="⏳" />
      </Form.Dropdown>
      <Form.Dropdown
        id="projectDropdown"
        title="Project"
        value={projectDropdown}
        defaultValue=""
        onChange={(value) => setProjectDropdown(value)}
      >
        <Form.Dropdown.Item key="none" value="" title="None" icon="❌" />
        {projects.map((project, index) => (
          <Form.Dropdown.Item key={index} value={project} title={project} icon="📂" />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

import { Plus, Trash2 } from "lucide-react";
interface ProjectFormProps {
  data: any;
  onChange: (value: any) => void;
}
const ProjectForm = ({ data, onChange }: ProjectFormProps) => {
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };

    onChange([...data, newProject]);
  };

  const removeProject = (index: number) => {
    const removeExperience = data.filter((_: string, i: number) => i !== index);
    onChange(removeExperience);
  };

  const updateProject = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...data] as any[];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add your projects</p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700  hover:bg-green-200 transition-colors rounded-lg"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-4">
        {data.map((project: any, index: number) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            <div className="flex justify-between items-center">
              <h4>Project #{index + 1}</h4>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <input
                type="text"
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                placeholder="Project Name"
                className="px-3 py-2 text-sm rounded-lg"
              />
              <input
                type="text"
                value={project.type || ""}
                onChange={(e) => updateProject(index, "type", e.target.value)}
                placeholder="Project Type"
                className="px-3 py-2 text-sm rounded-lg"
              />
              <textarea
                rows={4}
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "desription", e.target.value)
                }
                placeholder="DEscribe your project..."
                className="px-3 py-2 text-sm rounded-lg resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;

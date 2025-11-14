import { GraduationCap, Plus, Trash2 } from "lucide-react";
import type { Education } from "../assets/assets";
interface ExperienceFormProps {
  data: Education[];
  onChange: (value: Education[]) => void;
}
const EducationForm = ({ data = [], onChange }: ExperienceFormProps) => {
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };

    onChange([...data, newEducation]);
  };

  const removeEducation = (index: number) => {
    const removeExperience = data.filter(
      (_: Education, i: number) => i !== index
    );
    onChange(removeExperience);
  };

  const updateEducation = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700  hover:bg-green-200 transition-colors rounded-lg"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>No education added yet.</p>
          <p className="text-sm">Click 'Add Education' to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <h4>Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={education.institution || ""}
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  placeholder="Institution Name"
                  className="px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={education.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  placeholder="Degree(e.g., Bachelor's, MAster's)"
                  className="px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={education.field || ""}
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  placeholder="field of study"
                  className="px-3 py-2 text-sm "
                />
                <input
                  type="month"
                  value={education.graduation_date || ""}
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                  placeholder="graduation date"
                  className="px-3 py-2 text-sm"
                />
              </div>

              <input
                type="text"
                checked={education.gpa ? true : false}
                onChange={(e) => {
                  updateEducation(index, "gpa", e.target.value);
                }}
                placeholder="GPA(optional)"
                className="px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;

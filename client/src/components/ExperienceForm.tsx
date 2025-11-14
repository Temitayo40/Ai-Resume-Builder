import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import type { Experience } from "../assets/assets";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useState } from "react";
import api from "../configs/api";
import AxiosError from "../configs/axiosError";
interface ExperienceFormProps {
  data: Experience[];
  onChange: (value: Experience[]) => void;
}
const ExperienceForm = ({ data = [], onChange }: ExperienceFormProps) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);
  const addExperience = () => {
    const newExperince = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };

    onChange([...data, newExperince]);
  };

  const removeExperience = (index: number) => {
    const removeExperience = data.filter(
      (_: Experience, i: number) => i !== index
    );
    onChange(removeExperience);
  };
  const updateExperience = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const generateDescription = async (index: number) => {
    setGeneratingIndex(index);
    const experience = data[index];
    const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}`;

    try {
      const { data } = await api.post(
        "/api/ai/enhance-job-desc",
        {
          userContent: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateExperience(index, "description", data.enhancedContent);
    } catch (error) {
      AxiosError(error);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your job experience</p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700  hover:bg-green-200 transition-colors rounded-lg"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>
            No work experience added yet. <br /> click 'Add Experience' to get
            started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <h4>Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={experience.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm rounded-t-lg"
                />
                <input
                  type="text"
                  value={experience.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-t-lg"
                />
                <input
                  type="month"
                  value={experience.start_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  type="month"
                  value={experience.end_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  disabled={experience.is_current}
                  className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                />
              </div>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={experience.is_current}
                  onChange={(e) => {
                    updateExperience(
                      index,
                      "is_current",
                      e.target.checked ? true : false
                    );
                  }}
                  className="rounded border border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Currently working here
                </span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">
                    Job Description
                  </label>
                  <button
                    onClick={() => generateDescription(index)}
                    disabled={
                      generatingIndex === index ||
                      !experience.position ||
                      !experience.company
                    }
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {generatingIndex === index ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Enhance with AI
                  </button>
                </div>
                <textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full text-sm px-3 py-2 rounded-lg resize-none"
                  placeholder="Describe your key responsibilities and achievements"
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;

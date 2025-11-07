import { Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import type { ResumeData } from "../assets/assets";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import api from "../configs/api";
import AxiosError from "../configs/axiosError";

interface ProfessionalSummaryFormProps {
  data: string;
  onChange: (value: string) => void;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ProfessionalSummaryForm = ({
  data,
  onChange,
  setResumeData,
}: ProfessionalSummaryFormProps) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  // web developer with 6 years of experience building complex web apps using React JS, Node JS,
  const generateSummarry = async () => {
    try {
      setIsGenerating(true);
      const prompt = `enhance my professional summary "${data}"`;
      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        {
          userContent: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResumeData((prev) => ({
        ...prev,
        professional_summary: response.data.enhancedContent,
      }));
    } catch (error) {
      AxiosError(error);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add summary for your remsume here
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummarry}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Thinking..." : "AI Enhance"}
        </button>
      </div>
      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className="w-full p-3 px-4 mt-2 border texxt-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          placeholder="write a complelling professional summary that highlights your key strength and career objectives..."
        />

        <p className="text-xs text-gray-500 max-w-4/5 max-auto text-center">
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant
          achievements and skills
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;

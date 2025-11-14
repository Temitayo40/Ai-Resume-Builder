import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  type Education,
  type PersonalInfo,
  type ResumeData,
} from "../assets/assets";
import ColorPicker from "../components/ColorPicker";
import EducationForm from "../components/EducationForm";
import ExperienceForm from "../components/ExperienceForm";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ProjectForm from "../components/ProjectForm";
import ResumePreview from "../components/ResumePreview";
import SkillsForm from "../components/SkillsForm";
import TemplateSelector from "../components/TemplateSelector";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import api from "../configs/api";
import AxiosError from "../configs/axiosError";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const { token } = useSelector((state: RootState) => state.auth);
  const initialResume: ResumeData = {
    id: "",
    title: "",
    personal_info: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      profession: "",
      image: "",
    },
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3882f6",
    public: false,
  };

  const [resumeData, setResumeData] = useState<ResumeData>(initialResume);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary ", icon: FileText },
    { id: "experience", name: "Experience Info", icon: Briefcase },
    { id: "education", name: "Education Info", icon: GraduationCap },
    { id: "projects", name: "Projects Info", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get("/api/resumes/get/" + resumeId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      AxiosError(error);
    }
  };
  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId as string);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );

      const { data } = await api.patch("/api/resumes/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      AxiosError(error);
    }
  };

  const handleShare = () => {
    if (!resumeData.id) return;
    const frontendUrl = window.location.href.split("/app")[0];
    const resumeUrl = `${frontendUrl}/view/${resumeData.id}`;

    navigator.share({ url: resumeUrl, text: "My Resume" });
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume = async () => {
    try {
      const updatedResumeData = structuredClone(resumeData);
      if (
        typeof resumeData.personal_info.image === "object" &&
        updatedResumeData.personal_info
      ) {
        delete (updatedResumeData.personal_info as any).image;
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId as string);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) {
        formData.append("removeBackground", "yes");
      }
      if (typeof resumeData.personal_info.image === "object") {
        formData.append("image", resumeData.personal_info.image as any);
      }

      const { data } = await api.patch("/api/resumes/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setResumeData(data.resume);
      toast.success(data.message);
    } catch (error) {
      AxiosError(error);
    }
  };

  useEffect(() => {
    if (token) loadExistingResume();
  }, [token]);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left panel */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />

              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }}
              />

              {/* section navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template: string) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0)
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1)
                      )
                    }
                    className={`flex itemscenter gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* form content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data: PersonalInfo) =>
                      setResumeData((prev: ResumeData) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data: string) =>
                      setResumeData((prev: ResumeData) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data: Education[]) =>
                      setResumeData((prev: ResumeData) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.projects}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        projects: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>
              <button
                onClick={() => {
                  toast.promise(saveResume(), {
                    loading: "Saving...",
                    success: "Done!",
                    error: "Something went wrong",
                  });
                }}
                className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-480 transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* right panel */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover: :ring transition-colors"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}
                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                <button
                  onClick={downloadResume}
                  className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>

            {/*  resume preview */}
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

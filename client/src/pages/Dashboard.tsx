import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { type Resume } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import api from "../configs/api";
import toast from "react-hot-toast";
import axios from "axios";
import pdfToText from "react-pdftotext";
import AxiosError from "../configs/axiosError";

const Dashboard = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const navigate = useNavigate();
  const [allResumes, setAllResumes] = useState<Resume[]>([]);
  const [showCreateResume, SetShowCreateResume] = useState<boolean>(false);
  const [showUploadResume, SetShowUploadResume] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllResumes(data.resume);
    } catch (error) {
      AxiosError(error);
    }
  };

  const createResume = async (event: React.FormEvent<HTMLFormElement>) => {
    SetShowCreateResume(true);
    try {
      event?.preventDefault();
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      SetShowCreateResume(false);
      navigate(`/app/builder/${data?.resume?.id}`);
    } catch (error) {
      AxiosError(error);
    }
  };

  const uploadResume = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setIsLoading(true);
    try {
      if (!resume) {
        throw new Error("Please select a resume file");
      }
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle("");
      setResume(null);
      SetShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      AxiosError(error);
      setIsLoading(false);
    }
  };

  const editResume = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event?.preventDefault();
      const { data } = await api.patch(
        "/api/resumes/update/",
        { resumeId: editResumeId, resumeData: { title } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllResumes(
        allResumes.map((resume) =>
          resume.id === editResumeId ? { ...resume, title } : resume
        )
      );
      setTitle("");
      setEditResumeId("");
      console.log(data, "data here");
      toast.success(data.message);
    } catch (error) {
      AxiosError(error);
    }
  };

  const deleteResume = async (resumeId: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume"
      );
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllResumes(allResumes.filter((resume) => resume.id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      AxiosError(error);
    }
  };
  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text ext-transparent sm:hidden">
        Welcome , Adebowale
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => SetShowCreateResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
            Create Resume
          </p>
        </button>
        <button
          onClick={() => SetShowUploadResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
            Upload Existing
          </p>
        </button>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px] " />

      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes?.map((resume, index) => {
          const baseColor = colors[index % colors.length];
          return (
            <button
              key={resume.id}
              onClick={() => navigate(`/app/builder/${resume.id}`)}
              className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: baseColor + "40",
              }}
            >
              <FilePenLineIcon
                className="size-7 group-hover:scale-105 transition-all"
                style={{
                  color: baseColor,
                }}
              />

              <p
                className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                style={{
                  color: baseColor,
                }}
              >
                {resume.title}
              </p>
              <p
                className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                style={{ color: baseColor + "90" }}
              >
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-1 right-1 group-hover:flex items-center hidden"
              >
                <TrashIcon
                  onClick={() => deleteResume(resume.id)}
                  className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
                <PencilIcon
                  onClick={() => {
                    setEditResumeId(resume.id);
                    setTitle(resume.title);
                  }}
                  className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* create rsume modals */}
      {showCreateResume && (
        <form
          onSubmit={createResume}
          onClick={() => SetShowCreateResume(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
            <input
              type="text"
              placeholder="Enter resume title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600 required"
            />

            <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              Create Resume
            </button>
            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                SetShowCreateResume(false);
                setTitle("");
              }}
            />
          </div>
        </form>
      )}

      {/* upload resume modal */}
      {showUploadResume && (
        <form
          onSubmit={uploadResume}
          onClick={() => SetShowUploadResume(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
            <input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              value={title}
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600 required"
            />

            <div>
              <label
                htmlFor="resume-input"
                className="block text-sm text-slate-700"
              >
                Select resume file
                <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                  {resume ? (
                    <p className="text-green-700">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="size-14 stroke-1" />
                      <p>Upload Resume</p>
                    </>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="resume-input"
                accept=".pdf"
                hidden
                onChange={(e) => setResume(e.target.files?.[0] || null)}
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && (
                <LoaderCircleIcon className="animate-spin size-4 text-white" />
              )}
              {isLoading ? "Uploading..." : "Upload Resume"}
            </button>
            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                SetShowUploadResume(false);
                setTitle("");
              }}
            />
          </div>
        </form>
      )}

      {editResumeId && (
        <form
          onSubmit={editResume}
          onClick={() => setEditResumeId("")}
          className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
            <input
              type="text"
              placeholder="Enter resume title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600 required"
            />

            <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              Update Resume
            </button>
            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;

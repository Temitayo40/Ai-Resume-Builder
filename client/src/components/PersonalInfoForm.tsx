import {
  BriefcaseBusiness,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import React from "react";
import type { PersonalInfo } from "../assets/assets";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  removeBackground: boolean;
  setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Field {
  key: keyof PersonalInfo;
  label: string;
  icon: React.ComponentType<any>;
  type: string;
  required?: boolean;
}

const PersonalInfoForm = ({
  data = {} as PersonalInfo,
  onChange,
  removeBackground,
  setRemoveBackground,
}: PersonalInfoFormProps) => {
  const handleChange = <K extends keyof PersonalInfo>(
    field: K,
    value: PersonalInfo[K]
  ) => {
    onChange({ ...data, [field]: value } as PersonalInfo);
  };

  const fields: Field[] = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
    },

    {
      key: "location",
      label: "Location",
      icon: MapPin,
      type: "text",
    },
    {
      key: "profession",
      label: "Profession",
      icon: BriefcaseBusiness,
      type: "text",
    },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      icon: Linkedin,
      type: "url",
    },
    {
      key: "website",
      label: "Personal Website",
      icon: Globe,
      type: "url",
    },
  ];

  const getImageSrc = () => {
    if (!data?.image) return "";
    if (typeof data.image === "string") return data.image;
    try {
      return URL.createObjectURL(data.image);
    } catch {
      return "";
    }
  };

  const imageSrc = getImageSrc();

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h3>
      <p> Get Started wih the personal information</p>

      <div className="flex items-center gap-2">
        <label htmlFor="user-image">
          {data?.image ? (
            <img
              src={imageSrc}
              alt="user-image"
              className="w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80 cursor-pointer"
            />
          ) : (
            <div>
              <User className="size-10 p-2.5 border rounded-full cursor-pointer" />
              upload user image
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            id="user-image"
            onChange={(e) => handleChange("image", e.target.files?.[0] as any)}
          />
        </label>

        {typeof data?.image === "object" && (
          <div className="flex flex-col gap-1 pl-4 text-sm">
            <p>Remove Background</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground((prev) => !prev)}
                checked={removeBackground}
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-600 transition-colors duration-200"></div>
              <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
            </label>
          </div>
        )}
      </div>

      {fields.map((field) => {
        const Icon = field.icon;
        const value = (data?.[field.key] as unknown as string) || "";

        return (
          <div key={field.key} className="space-y-1 mt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Icon className="size-4" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            <input
              type={field.type}
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="mt-1 w-full px-3 py-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfoForm;

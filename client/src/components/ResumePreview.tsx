import type { ResumeData } from "../assets/assets";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ModernTemplate from "./templates/ModernTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
  accentColor: string;
  classes?: string;
}
const ResumePreview = ({
  data,
  template,
  accentColor,
  classes = "",
}: ResumePreviewProps) => {
  const rendeTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "mininal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;

      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };
  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={
          "border border-gray-200 print:shadow-none print:border-none " +
          classes
        }
      >
        {rendeTemplate()}
      </div>
      <style>
        {`
           @page {
            margin: 0;
            size: letter;
            }

            @media print {
             html, body {
              width: 8.5in;
              height: 11in;
              overflow: hidden;
              }

              body * {
              visibility: hidden;
              }

              #resume-preview, #resume-preview * {
              visibility: visible;
              }

              #resume-preview {
              position: absolute;
              left: 0;
              top: 0
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
              }
            } 

          `}
      </style>
    </div>
  );
};

export default ResumePreview;

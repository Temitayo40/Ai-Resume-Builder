interface TitleProps {
  title: string;
  description: string;
}

const Title = ({ title, description }: TitleProps) => {
  return (
    <div className="text-center mt-6 text-slate-700">
      <div className="text-3xl sm:text-4xl font-medium">{title}</div>
      <div className="max-sm max-w-2xl mt-4 text-slate-500">{description}</div>
    </div>
  );
};

export default Title;

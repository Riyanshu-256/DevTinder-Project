const SkeletonBase = ({ className = "", variant = "default" }) => {
  const variants = {
    default: "skeleton",
    card: "skeleton h-64 rounded-2xl",
    avatar: "skeleton w-24 h-24 rounded-full",
    text: "skeleton h-4 rounded",
    title: "skeleton h-6 rounded w-3/4",
    button: "skeleton h-10 rounded-xl w-24",
  };

  return <div className={`${variants[variant]} ${className}`} />;
};

export const SkeletonCard = () => {
  return (
    <div className="card-modern p-6 space-y-4">
      <SkeletonBase variant="avatar" className="mx-auto" />
      <SkeletonBase variant="title" className="mx-auto" />
      <SkeletonBase variant="text" className="w-full" />
      <SkeletonBase variant="text" className="w-5/6 mx-auto" />
      <div className="flex gap-2 justify-center">
        <SkeletonBase variant="button" />
        <SkeletonBase variant="button" />
      </div>
    </div>
  );
};

export const SkeletonConnectionCard = () => {
  return (
    <div className="card-modern card-modern-hover p-6">
      <div className="flex flex-col items-center space-y-4">
        <SkeletonBase variant="avatar" />
        <SkeletonBase variant="title" className="w-32" />
        <SkeletonBase variant="text" className="w-full" />
        <div className="flex gap-2 flex-wrap justify-center w-full">
          <SkeletonBase variant="button" className="h-6 w-16" />
          <SkeletonBase variant="button" className="h-6 w-16" />
          <SkeletonBase variant="button" className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
};

const Skeleton = SkeletonBase;

export default Skeleton;

"use client";

const ProblemInfoTitle = ({ name, creator, date }) => {
  return (
    <>
      <h2 className="mt-2 xl:mt-3 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold text-textBackground dark:text-dark-textBackground">
        {name}
      </h2>
      <small className="mt-1 text-xs md:text-sm xl:text-base italic text-textBackground dark:text-dark-textBackground">
        Created by {creator.name} ({creator.id}) on{" "}
        {new Date(date).toLocaleDateString()}{" "}
        {new Date(date).toLocaleTimeString()}
      </small>
    </>
  );
};

export default ProblemInfoTitle;

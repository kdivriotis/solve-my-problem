"use client";

const DisplayResultLP = ({ result }) => {
  const { objective, ...variables } = result;

  const textClass = "text-center text-xs md:text-sm xl:text-base text-textBackground dark:text-dark-textBackground";
  const valueClass = "text-primary dark:text-dark-primary";

  return (
    <>
      <h5 className={textClass}>
        Objective function's value ={" "}
        <span className={valueClass}>{objective}</span>
        <br />
        with the following values for each variable:
      </h5>
      {Object.entries(variables).map(([name, value]) => {
        return (
          <p key={name} className={`my-2 ${textClass}`}>
            {name}: <span className={valueClass}>{value}</span>
          </p>
        );
      })}
    </>
  );
};

export default DisplayResultLP;

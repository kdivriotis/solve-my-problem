"use client";

const ProblemMetadata = ({ metadata }) => {
  // Define base values of classes
  const gridCellBaseClass =
    "px-1 sm:px-2 lg:px-4 text-left max-w-full break-words";
  const gridRowBaseClass = "grid grid-cols-5 py-1 lg:py-2 text-sm lg:text-base";
  const gridCol1SizeClass = "col-span-1";
  const gridCol2SizeClass = "col-span-2";
  const gridCol3SizeClass = "col-span-2";

  if (!metadata || metadata.length === 0) return <></>;

  return (
    <div className="w-full">
      <h3 className="mt-2 xl:mt-3 text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold text-textBackground dark:text-dark-textBackground">
        Metadata
      </h3>
      <div className="w-full mt-1 xl:mt-2 rounded-md overflow-hidden">
        <div
          className={`${gridRowBaseClass} bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary`}
        >
          <h3 className={`${gridCellBaseClass} ${gridCol1SizeClass}`}>Name</h3>
          <h3 className={`${gridCellBaseClass} ${gridCol2SizeClass}`}>
            Description
          </h3>
          <h3 className={`${gridCellBaseClass} ${gridCol3SizeClass}`}>Value</h3>
        </div>

        {metadata.map((m, index) => (
          <div
            key={m.name}
            className={`${gridRowBaseClass}
                        ${
                          index % 2 === 0
                            ? "bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
                            : "bg-surface-hover dark:bg-dark-surface-hover text-textSurface-hover dark:text-dark-textSurface-hover"
                        }
                      `}
          >
            <p className={`${gridCellBaseClass} ${gridCol1SizeClass}`}>
              {m.name}
            </p>
            <p className={`${gridCellBaseClass} ${gridCol2SizeClass}`}>
              {m.description}
            </p>
            <p className={`${gridCellBaseClass} ${gridCol3SizeClass}`}>
              {m.value} {m.uom}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemMetadata;

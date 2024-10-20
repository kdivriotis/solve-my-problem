"use client";

const StepDisplay = ({ steps, currentStep, onStepSelection }) => {
  return (
    <div className="my-2 w-full flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 flex items-center justify-center text-xs md:text-sm xl:text-lg
                rounded-full border-2 border-textSurface dark:border-dark-textSurface transition-colors duration-300 ${
                  currentStep > step
                    ? "cursor-pointer bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary \
                            hover:bg-primary-hover dark:hover:bg-dark-primary-hover hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover"
                    : currentStep === step
                    ? "bg-primary-hover dark:bg-dark-primary-hover text-textPrimary-hover dark:text-dark-textPrimary-hover"
                    : "bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
                }`}
            onClick={() => onStepSelection(step)}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <div className="w-2 border-t-2 border-textSurface dark:border-dark-textSurface"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepDisplay;

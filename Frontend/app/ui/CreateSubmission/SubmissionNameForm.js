"use client";

const SubmissionNameForm = ({
  selectedModel,
  name,
  onNameChange,
  formError,
}) => {
  const handleTextChange = (event) => {
    onNameChange(event.target.value);
  };

  const handleChangeFinished = (event) => {
    onNameChange(event.target.value.trim());
  };

  return (
    <>
      <legend className="mt-2 text-lg md:text-xl lg:text-2xl text-center text-textSurface dark:text-dark-textSurface">
        Enter your submission's name
      </legend>
      {formError && formError.toString().trim() && (
        <p className="text-center text-xs md:text-sm text-error dark:text-dark-error my-2">
          {formError}
        </p>
      )}

      <div className="my-4">
        <label
          className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-bold mb-2"
          htmlFor="model"
        >
          Model
        </label>
        <select
          className="w-full px-3 py-2 rounded-md text-sm md:text-base
                bg-disabled dark:bg-dark-disabled text-textDisabled dark:text-dark-textDisabled
                focus:outline-none focus:ring-0 focus:ring-transparent dark:focus:ring-transparent"
          id="model"
          disabled={true}
        >
          <option defaultChecked>
            {selectedModel.name} ({selectedModel.id})
          </option>
        </select>
      </div>

      <div className="my-4">
        <label
          className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="w-full px-3 py-2 rounded-md text-sm md:text-base
                bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
                focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
          id="name"
          type="text"
          placeholder="Submission's name..."
          value={name}
          onChange={handleTextChange}
          onBlur={handleChangeFinished}
          required
          aria-required
        />
      </div>
    </>
  );
};

export default SubmissionNameForm;

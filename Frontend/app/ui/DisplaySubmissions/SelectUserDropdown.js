"use client";

const SelectUserDropdown = ({
  isActive,
  isLoading,
  error,
  users,
  selected,
  onSelectionChange,
}) => {
  const handleUserChange = (e) => {
    const newUserId = e.target.value;
    onSelectionChange(newUserId);
  };

  return (
    <div className="w-full mt-8 sm:mt-12 md:mt-16">
      {isActive ? (
        <>
          <label
            className="block text-sm md:text-base text-textBackground dark:text-dark-textBackground font-bold mb-2"
            htmlFor="user"
          >
            Select user:
          </label>
          <select
            className="w-full px-3 py-2 rounded-md text-sm md:text-base
                bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface
                focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
            id="user"
            placeholder="Select a user"
            disabled={isLoading}
            value={selected}
            onChange={handleUserChange}
            required
            aria-required
          >
            <option
              defaultChecked
              value={""}
              className="text-xs md:text-sm xl:text-base text-ellipsis"
            >
              Default (You)
            </option>
            {users.map((user, index) => (
              <option
                key={user.id}
                value={user.id}
                className="text-xs md:text-sm xl:text-base text-ellipsis"
              >
                {user.email} ({user.id})
              </option>
            ))}
          </select>
          {error && error.toString().trim() !== "" ? (
            <p className="mt-2 text-xs md:text-sm xl:text-base text-textSurface dark:text-dark-textSurface">
              {error}
            </p>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SelectUserDropdown;

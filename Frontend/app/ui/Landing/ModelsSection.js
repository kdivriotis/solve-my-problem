"use client";

const ModelsSection = () => {
  const models = [
    {
      name: "Vehicle Routing",
      description:
        "The Vehicle Routing Problem (VRP) is a combinatorial optimization and integer programming problem that seeks the most efficient way to deliver goods to various locations using a fleet of vehicles. The objective is to minimize the total delivery cost, which can include factors such as distance traveled, time, and the number of vehicles used.",
    },
    {
      name: "Linear Programming",
      description:
        "Linear Programming (LP) is a mathematical method for determining a way to achieve the best outcome (such as maximum profit or lowest cost) in a given mathematical model whose requirements are represented by linear relationships. It is widely used in various fields such as economics, business, engineering, and military applications.",
    },
  ];
  return (
    <section
      id="models"
      className="w-full py-10 md:py-40 flex flex-col justify-center items-center gap-y-3"
    >
      <h1 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-primary dark:text-dark-primary">
        Available Models
      </h1>
      <div className="mt-8 w-full flex flex-col md:flex-row items-stretch gap-y-3 md:gap-y-0 md:gap-x-2 lg:gap-x-3 xl:gap-x-4">
        {models.map((model) => (
          <div
            key={model.name}
            className="bg-surface dark:bg-dark-surface rounded-md p-4 flex-grow"
          >
            <h3 className="text-lg md:text-base lg:text-lg xl:text-xl font-semibold text-textSurface-hover dark:text-dark-textSurface-hotext-textSurface-hover">
              {model.name}
            </h3>
            <p className="mt-8 text-textSurface dark:text-dark-textSurface">
              {model.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ModelsSection;

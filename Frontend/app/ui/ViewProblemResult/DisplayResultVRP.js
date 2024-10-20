"use client";

const DisplayResultVRP = ({ result }) => {
  const { objective, maxDistance, routes } = result;

  // Only show up to 15 vehicles (don't flood the UI)
  const displayedRoutes = routes.length > 15 ? routes.slice(0, 15) : routes;

  const textClass =
    "text-center text-xs md:text-sm xl:text-base text-textBackground dark:text-dark-textBackground";
  const titleClass =
    "text-left text-xs md:text-sm xl:text-base text-primary dark:text-dark-primary";
  const subtitleClass =
    "text-left text-xs md:text-sm xl:text-base text-textBackground dark:text-dark-textBackground";
  const valueClass = "text-primary dark:text-dark-primary";

  return (
    <>
      <h5 className={textClass}>
        Objective function's value ={" "}
        <span className={valueClass}>{objective}</span>
        <br />
        with the maximum distance ={" "}
        <span className={valueClass}>{maxDistance}</span> meters.
      </h5>
      {displayedRoutes.map(({ vehicle, distance, locations }) => {
        // Only show up to 50 locations of each route (don't flood the UI)
        const displayedLocations =
          locations.length > 50 ? locations.slice(0, 48) : locations;
        let displayedLocationsStr = displayedLocations.join(" -> ");
        // No locations visited - stayed at depot
        if (displayedLocations.length === 2)
          displayedLocationsStr = "Stay at depot";
        else if (displayedLocations.length < locations.length) {
          const remainingLocations =
            locations.length - displayedLocations.length;
          displayedLocationsStr += ` -> ...${remainingLocations} more locations... -> ${
            locations[locations.length - 1]
          }`;
        }

        return (
          <div key={`vehicle-${vehicle}`} className="my-2">
            <h5 className={titleClass}>Vehicle {vehicle}</h5>
            <p className={subtitleClass}>
              Total Distance = <span className={valueClass}>{distance}</span>{" "}
              meters.
            </p>
            <p className={subtitleClass}>Route:</p>
            <p className={titleClass}>{displayedLocationsStr}</p>
          </div>
        );
      })}
      {displayedRoutes.length < routes.length ? (
        <p className={titleClass}>
          ...{routes.length - displayedRoutes.length} more vehicles
        </p>
      ) : (
        <></>
      )}
    </>
  );
};

export default DisplayResultVRP;

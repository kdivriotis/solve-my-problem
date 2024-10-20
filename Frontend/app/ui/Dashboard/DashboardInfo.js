"use client";

import { FaUser, FaCalendar } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

const DashboardInfo = ({ name, email, date }) => {
  const cards = [
    {
      name: "Name",
      Icon: FaUser,
      value: name,
      error: null,
      hasError: false,
      isLoading: false,
    },
    {
      name: "Email",
      Icon: MdOutlineAlternateEmail,
      value: email,
      error: null,
      hasError: false,
      isLoading: false,
    },
    {
      name: "Member Since",
      Icon: FaCalendar,
      value: new Date(date).toLocaleDateString(),
      error: null,
      hasError: false,
      isLoading: false,
    },
  ];

  return (
    <div className="w-full grid grid-cols-3 gap-2 2xl:gap-3">
      {cards.map((card) => (
        <div
          key={card.name}
          className="col-span-1 w-full px-1 py-2 sm:p-2 lg:p-3 flex flex-col md:flex-row gap-3 md:gap-2 xl:gap-3 
          justify-start md:justify-center items-center max-w-full break-words overflow-x-hidden
          bg-surface dark:bg-dark-surface rounded-md shadow-md shadow-primary"
        >
          {/* Icon */}
          <div className="p-4 bg-surface-hover dark:bg-dark-surface-hover rounded-full">
            <card.Icon className="w-[32px] h-[32px] text-textSurface-hover dark:text-dark-textSurface-hover" />
          </div>

          {/* Info */}
          <div className="md:flex-grow flex flex-col gap-1 justify-center items-center md:items-start rounded-md max-w-full md:max-w-[calc(100%-74px)]">
            <span className="text-sm md:text-base xl:text-lg font-bold text-textSurface dark:text-dark-textSurface break-words">
              {card.name}
            </span>
            {card.isLoading ? (
              <div className="w-4/5 md:w-1/3 lg:w-1/4 animate-pulse rounded">
                <div className="w-full h-[5px] md:h-[6px] xl:h-[7px] bg-textSurface dark:bg-dark-textSurface rounded"></div>
              </div>
            ) : card.hasError ? (
              <span className="text-xs md:text-sm xl:text-base font-normal text-error dark:text-dark-error">
                {card.error}
              </span>
            ) : (
              <span className="text-base md:text-lg xl:text-xl font-semibold text-textSurface-hover dark:text-dark-textSurface-hover max-w-full break-words">
                {card.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardInfo;

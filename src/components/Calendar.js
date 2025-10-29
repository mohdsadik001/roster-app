export default function Calendar({ calendar, numGroups, totalCalendarDays }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Mandatory":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "weekoff":
        return "bg-red-100 text-red-800 border-red-300";
      case "present":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-purple-600">
            <th className="border border-gray-300 px-3 py-2 text-white font-semibold sticky left-0 bg-gradient-to-r from-blue-600 to-purple-600 z-10">
              Row
            </th>
            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
              <th
                key={idx}
                className="border border-gray-300 px-3 py-2 text-white font-semibold min-w-[100px]"
              >
                {day.date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Day Row */}
          <tr className="bg-blue-50">
            <td className="border border-gray-300 px-3 py-2 font-semibold sticky left-0 bg-blue-50 z-10">
              Day
            </td>
            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
              <td
                key={idx}
                className="border border-gray-300 px-3 py-2 text-center font-medium"
              >
                {day.day}
              </td>
            ))}
          </tr>
          {/* Task Row */}
          <tr className="bg-yellow-50">
            <td className="border border-gray-300 px-3 py-2 font-semibold sticky left-0 bg-yellow-50 z-10">
              Task
            </td>
            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
              <td
                key={idx}
                className="border border-gray-300 px-3 py-2 text-center"
              >
                {day.task && (
                  <span className="px-2 py-1 bg-yellow-200 text-yellow-900 rounded-full text-sm font-medium">
                    {day.task}
                  </span>
                )}
              </td>
            ))}
          </tr>
          {/* Group Rows */}
          {Array.from({ length: numGroups }).map((_, groupIdx) => (
            <tr key={groupIdx} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2 font-semibold sticky left-0 bg-white z-10">
                Group {groupIdx + 1}
              </td>
              {calendar.slice(0, totalCalendarDays).map((day, dayIdx) => (
                <td
                  key={dayIdx}
                  className="border border-gray-300 px-3 py-2 text-center"
                >
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      day.groups[groupIdx]
                    )}`}
                  >
                    {day.groups[groupIdx]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
          {/* Submission Row */}
          // In the Calendar component, update the Submission row section:
          {/* Submission Row */}
          <tr className="bg-indigo-50">
            <td className="border border-gray-300 px-3 py-2 font-semibold sticky left-0 bg-indigo-50 z-10">
              Submission
            </td>
            {calendar.slice(0, totalCalendarDays).map((day, idx) => {
              const isValid =
                day.day === "Friday" ||
                day.day === "Saturday" ||
                day.day === "Sunday" ||
                idx < 2;
              const hasWeekoff = day.groups.some((g) => g === "weekoff");

              return (
                <td
                  key={idx}
                  className="border border-gray-300 px-3 py-2 text-center"
                >
                  {day.submission && (
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          hasWeekoff
                            ? "bg-red-200 text-red-900 border border-red-400"
                            : "bg-indigo-200 text-indigo-900"
                        }`}
                      >
                        {day.submission}
                      </span>
                      {hasWeekoff && (
                        <span className="text-xs text-red-600">⚠️ Invalid</span>
                      )}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-xs font-medium">
            Mandatory
          </span>
          <span className="text-sm text-gray-600">First 2 days</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded-full text-xs font-medium">
            present
          </span>
          <span className="text-sm text-gray-600">Working day</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-300 rounded-full text-xs font-medium">
            weekoff
          </span>
          <span className="text-sm text-gray-600">Day off</span>
        </div>
      </div>
    </div>
  );
}

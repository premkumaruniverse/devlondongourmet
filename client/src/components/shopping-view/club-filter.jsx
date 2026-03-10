import { Badge } from "../ui/badge";

const experienceTypeOptions = [
  { id: "SUPPER_CLUB", label: "Supper Club" },
  { id: "CHEFS_TABLE", label: "Chef's Table" },
  { id: "WINE_TASTING", label: "Wine Tasting" },
  { id: "MASTERCLASS", label: "Masterclass" },
  { id: "FARM_TO_TABLE", label: "Farm to Table" },
];

function ClubFilter({ filters, handleFilter }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3 dark:text-white">Experience Type</h3>
        <div className="space-y-2">
          {experienceTypeOptions.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md transition-colors ${
                filters?.experience_type?.includes(option.id)
                  ? "bg-amber-500 text-[#1a0505]"
                  : "hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => handleFilter("experience_type", option.id)}
            >
              <input
                type="checkbox"
                checked={filters?.experience_type?.includes(option.id) || false}
                onChange={() => handleFilter("experience_type", option.id)}
                className="rounded border-gray-300 dark:bg-white/5 dark:border-white/10 accent-amber-500"
              />
              <label className="text-sm font-medium cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 dark:text-white">Special Filters</h3>
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-amber-500/10 dark:text-gray-400 dark:hover:text-amber-500 dark:border-white/10 dark:hover:border-amber-500/40"
          >
            Members Only
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default ClubFilter;

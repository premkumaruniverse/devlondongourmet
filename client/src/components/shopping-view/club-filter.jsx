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
        <h3 className="font-semibold mb-3">Experience Type</h3>
        <div className="space-y-2">
          {experienceTypeOptions.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md transition-colors ${
                filters?.experience_type?.includes(option.id)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleFilter("experience_type", option.id)}
            >
              <input
                type="checkbox"
                checked={filters?.experience_type?.includes(option.id) || false}
                onChange={() => handleFilter("experience_type", option.id)}
                className="rounded"
              />
              <label className="text-sm font-medium cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Special Filters</h3>
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-yellow-100"
          >
            Members Only
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default ClubFilter;

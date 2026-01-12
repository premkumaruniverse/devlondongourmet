import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CalendarIcon, UsersIcon, StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ShoppingClubTile({
  club,
}) {
  const navigate = useNavigate();
  const experienceTypeLabels = {
    SUPPER_CLUB: "Supper Club",
    CHEFS_TABLE: "Chef's Table",
    WINE_TASTING: "Wine Tasting",
    MASTERCLASS: "Masterclass",
    FARM_TO_TABLE: "Farm to Table",
  };

  const getExperienceTypeColor = (type) => {
    const colors = {
      SUPPER_CLUB: "bg-purple-500 hover:bg-purple-600",
      CHEFS_TABLE: "bg-orange-500 hover:bg-orange-600",
      WINE_TASTING: "bg-red-500 hover:bg-red-600",
      MASTERCLASS: "bg-blue-500 hover:bg-blue-600",
      FARM_TO_TABLE: "bg-green-500 hover:bg-green-600",
    };
    return colors[type] || "bg-gray-500 hover:bg-gray-600";
  };

  const nextSchedule = club.nextSchedule; // Use nextSchedule from API
  const availableSeats = nextSchedule ? nextSchedule.seat_limit - nextSchedule.seats_booked : 0;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => navigate(`/shop/gourmet-club/${club?._id}`)}>
        <div className="relative">
          <img
            src={club?.images?.[0] || "/placeholder-club.jpg"}
            alt={club?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = "/placeholder-club.jpg";
            }}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className={`${getExperienceTypeColor(club?.experience_type)} text-white`}>
              {experienceTypeLabels[club?.experience_type]}
            </Badge>
            {club?.is_members_only && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Members Only
              </Badge>
            )}
          </div>
          {availableSeats > 0 && availableSeats <= 5 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500 hover:bg-red-600 text-white">
                Only {availableSeats} left!
              </Badge>
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-2 line-clamp-1">{club?.title}</h2>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {club?.description}
        </p>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">
              {club?.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <span className="text-muted-foreground text-sm">
            ({club?.totalReviews || 0} reviews)
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <UsersIcon className="h-4 w-4" />
            <span className="text-sm">Host: {club?.host_id?.name}</span>
          </div>
        </div>

        {nextSchedule && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">
                {new Date(nextSchedule.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-primary">
            ${nextSchedule?.price_per_guest || "0"}
          </span>
          <span className="text-sm text-muted-foreground">per guest</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => navigate(`/shop/gourmet-club/${club?._id}`)}
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingClubTile;

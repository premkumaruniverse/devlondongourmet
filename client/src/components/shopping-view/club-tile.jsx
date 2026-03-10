import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, CalendarIcon, UsersIcon, StarIcon } from "lucide-react";
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
    <Card className="w-full max-w-sm mx-auto overflow-hidden border-2 border-stone-100 dark:border-white/10 bg-white dark:bg-[#1a0606] transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] dark:hover:shadow-none hover:-translate-y-2 group/card">
      <div onClick={() => navigate(`/shop/gourmet-club/${club?._id}`)} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={club?.images?.[0] || "/placeholder-club.jpg"}
            alt={club?.title}
            className="w-full h-[300px] object-cover transition-transform duration-700 group-hover/card:scale-110"
            onError={(e) => {
              e.target.src = "/placeholder-club.jpg";
            }}
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className={`${getExperienceTypeColor(club?.experience_type)} text-white font-black uppercase tracking-widest text-[8px] px-3 py-1 shadow-lg`}>
              {experienceTypeLabels[club?.experience_type]}
            </Badge>
            {club?.is_members_only && (
              <Badge className="bg-amber-500 text-[#1a0505] font-black uppercase tracking-widest text-[8px] px-3 py-1 shadow-lg">
                MEMBERS ONLY
              </Badge>
            )}
          </div>
          {availableSeats > 0 && availableSeats <= 5 && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white font-black uppercase tracking-widest text-[8px] px-3 py-1 animate-pulse">
                LIMITED: {availableSeats} LEFT
              </Badge>
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-6">
        <h2 className="text-xl font-black mb-3 line-clamp-1 text-[#1a0505] dark:text-white uppercase tracking-tighter italic italic group-hover/card:text-amber-600 transition-colors uppercase">{club?.title}</h2>
        <p className="text-xs text-stone-400 dark:text-gray-500 mb-6 line-clamp-2 italic leading-relaxed uppercase tracking-wide">
          {club?.description}
        </p>
        
        <div className="flex items-center gap-4 mb-4 border-t border-stone-100 dark:border-white/5 pt-4">
          <div className="flex items-center gap-1">
            <StarIcon className="h-3 w-3 text-amber-500 fill-current" />
            <span className="text-[10px] font-black text-[#1a0505] dark:text-gray-300">
              {club?.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <span className="text-stone-300 dark:text-gray-600 text-[9px] font-bold uppercase tracking-widest">
            {club?.totalReviews || 0} CRITIQUES
          </span>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-2 text-stone-400 dark:text-gray-500">
            <UsersIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Host: {club?.host_id?.name}</span>
          </div>
          {nextSchedule && (
            <div className="flex items-center gap-2 text-stone-400 dark:text-gray-500">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {new Date(nextSchedule.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end border-t border-stone-100 dark:border-white/5 pt-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-stone-300 dark:text-gray-600 italic">Participation</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-500 tabular-nums tracking-tighter italic">
              £{nextSchedule?.price_per_guest || "0"}
            </div>
          </div>
          <span className="text-[9px] font-black text-stone-300 dark:text-gray-700 tracking-widest uppercase">PER GUEST</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => navigate(`/shop/gourmet-club/${club?._id}`)}
          className="w-full h-14 bg-[#1a0505] dark:bg-amber-500/10 hover:bg-black dark:hover:bg-amber-500 text-white dark:text-amber-500 dark:hover:text-[#1a0505] transition-all duration-500 rounded-xl font-black uppercase tracking-[4px] text-[10px] shadow-xl shadow-black/10 group/btn"
        >
          VIEW DOSSIER <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingClubTile;

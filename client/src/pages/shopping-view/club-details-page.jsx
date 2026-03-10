import { ArrowLeftIcon, StarIcon, CalendarIcon, UsersIcon, ClockIcon, DollarSignIcon, MapPinIcon, CheckIcon, XIcon, ShieldIcon, AwardIcon, UtensilsIcon, WineIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { setClubDetails } from "@/store/shop/clubs-slice";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { useEffect, useState } from "react";
import { addClubReview, getClubReviews, fetchClubDetails } from "@/store/shop/clubs-slice";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";

function ClubDetailsPage() {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { clubDetails, reviews } = useSelector((state) => state.shopClubs);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

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

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + (reviewItem.review_value || 0), 0) / reviews.length
      : 0;

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    dispatch(
      addClubReview({
        clubId: clubDetails?.club?._id,
        reviewData: {
          reviewMessage: reviewMsg,
          reviewValue: rating,
          userId: user?.id,
          userName: user?.userName,
        },
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  function handleGoBack() {
    navigate("/shop/gourmet-club");
  }

  function handleBooking() {
    if (!user) {
      toast({
        title: "Please log in to book this experience",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    toast({
      title: "Booking Requested!",
      description: `Your request for ${clubDetails?.club?.title} on ${new Date(selectedSchedule.date).toLocaleDateString()} has been received.`,
    });
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchClubDetails(id));
    }
    
    return () => {
      dispatch(setClubDetails());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (clubDetails?.club?._id) {
      dispatch(getClubReviews(clubDetails?.club?._id));
      if (clubDetails?.schedules?.length > 0) {
        setSelectedSchedule(clubDetails.schedules[0]);
      }
    }
  }, [clubDetails, dispatch]);

  if (!clubDetails || !clubDetails.club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading club details...</p>
        </div>
      </div>
    );
  }

  const { club, schedules } = clubDetails;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0303]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#0c0303]/80 backdrop-blur-xl border-b border-stone-100 dark:border-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2 dark:text-foreground dark:hover:bg-white/5"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Clubs
            </Button>
            <h1 className="text-2xl font-bold dark:text-amber-500">{club?.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative overflow-hidden rounded-xl border dark:border-white/5">
              <img
                src={club?.images?.[0] || "/placeholder-club.jpg"}
                alt={club?.title || "Club image"}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className={`${getExperienceTypeColor(club?.experience_type)} text-white border-none`}>
                  {experienceTypeLabels[club?.experience_type]}
                </Badge>
                {club?.is_members_only && (
                  <Badge className="bg-amber-500 text-[#1a0505] border-none font-bold">
                    Members Only
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold mb-4 dark:text-white">{club?.title}</h2>
                <p className="text-lg text-muted-foreground mb-6 dark:text-gray-400">
                  {club?.description}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <StarRatingComponent rating={averageReview} />
                  <span className="text-muted-foreground">
                    ({(averageReview || 0).toFixed(2)} - {reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Host Section */}
              <div className="bg-stone-50/50 dark:bg-white/[0.03] rounded-[2.5rem] p-10 border-2 border-stone-100 dark:border-white/5 shadow-sm">
                <h3 className="text-[10px] font-black mb-8 dark:text-amber-500 uppercase tracking-[4px] text-stone-400 italic">Curated By</h3>
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 border-2 border-amber-500/20">
                    <img src={club?.host_id?.image} className="object-cover" />
                    <AvatarFallback>{club?.host_id?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg dark:text-white">{club?.host_id?.name}</h4>
                    <p className="text-amber-500 text-sm font-medium mb-2">{club?.host_id?.title}</p>
                    <p className="text-sm dark:text-gray-300 leading-relaxed">{club?.host_id?.bio}</p>
                  </div>
                </div>
              </div>

              {/* Event Info Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-stone-50/50 dark:bg-white/[0.03] rounded-[2.5rem] p-10 border-2 border-stone-100 dark:border-white/5 shadow-sm">
                  <h3 className="text-[10px] font-black mb-8 flex items-center gap-3 dark:text-amber-500 uppercase tracking-[4px] text-stone-400 italic">
                    <CalendarIcon className="h-4 w-4" />
                    Protocol Specifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-xs uppercase tracking-tighter text-muted-foreground">Duration</p>
                        <p className="font-medium dark:text-white">{selectedSchedule?.duration || club?.default_duration || "2-3 hours"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UsersIcon className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-xs uppercase tracking-tighter text-muted-foreground">Group Size</p>
                        <p className="font-medium dark:text-white">{selectedSchedule?.seat_limit || club?.default_group_size || "2-8 guests"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-xs uppercase tracking-tighter text-muted-foreground">Location</p>
                        <p className="font-medium dark:text-white">{club?.location?.address || club?.default_location_description || "Secret Location"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50/50 dark:bg-white/[0.03] rounded-[2.5rem] p-10 border-2 border-stone-100 dark:border-white/5 shadow-sm">
                  <h3 className="text-[10px] font-black mb-8 flex items-center gap-3 dark:text-amber-500 uppercase tracking-[4px] text-stone-400 italic">
                    <UtensilsIcon className="h-4 w-4" />
                    Gastronomy Intelligence
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <WineIcon className="h-4 w-4 text-amber-500" />
                      <span className="text-sm dark:text-white">{club?.includes_alcohol ? "Alcohol Included" : "No Alcohol"}</span>
                    </div>
                    {club?.cuisine_type && (
                      <div className="flex items-center gap-3">
                        <UtensilsIcon className="h-4 w-4 text-amber-500" />
                        <span className="text-sm dark:text-white">{club?.cuisine_type} Cuisine</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            <div className="bg-white border rounded-2xl p-6 sticky top-24 dark:bg-[#1a0606] dark:border-white/5 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 dark:text-white uppercase tracking-tight">Book Experience</h3>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">Select Date</h4>
                {schedules && schedules.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule._id}
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                          selectedSchedule?._id === schedule._id
                            ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500"
                            : "dark:border-white/5 dark:bg-white/5 hover:border-amber-500/50"
                        }`}
                        onClick={() => setSelectedSchedule(schedule)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-bold dark:text-white">
                              <CalendarIcon className="h-3 w-3 text-amber-500" />
                              {new Date(schedule.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <ClockIcon className="h-3 w-3" /> {schedule.start_time}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80">
                              {schedule.seat_limit - schedule.seats_booked} spots left
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black dark:text-amber-500">£{schedule.price_per_guest}</div>
                            <div className="text-[10px] uppercase text-muted-foreground">per guest</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                    <p className="text-muted-foreground text-sm">No upcoming dates</p>
                  </div>
                )}
              </div>

              {selectedSchedule && (
                <div className="border-t dark:border-white/5 pt-4 mb-6">
                  <div className="flex justify-between items-center font-bold text-2xl dark:text-white">
                    <span className="text-sm font-medium text-muted-foreground">Total</span>
                    <span>£{selectedSchedule.price_per_guest}</span>
                  </div>
                </div>
              )}

              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-[#1a0505] font-black h-14 rounded-xl text-lg uppercase tracking-widest transition-all duration-300 shadow-xl shadow-amber-500/10 disabled:opacity-50"
                disabled={!selectedSchedule || (selectedSchedule.seat_limit - selectedSchedule.seats_booked === 0)}
                onClick={handleBooking}
              >
                {!selectedSchedule 
                  ? "Select a date" 
                  : selectedSchedule.seat_limit - selectedSchedule.seats_booked === 0 
                  ? "Sold Out" 
                  : "Book Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubDetailsPage;

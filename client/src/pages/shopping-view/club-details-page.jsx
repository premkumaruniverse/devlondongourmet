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
      // Set first schedule as default
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
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b dark:bg-background dark:border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2 dark:text-foreground dark:hover:bg-muted"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Clubs
            </Button>
            <h1 className="text-2xl font-bold dark:text-primary">{club?.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={club?.images?.[0] || "/placeholder-club.jpg"}
                alt={club?.title || "Club image"}
                className="w-full h-[400px] object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-club.jpg";
                }}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                  {experienceTypeLabels[club?.experience_type]}
                </Badge>
                {club?.is_members_only && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    Members Only
                  </Badge>
                )}
              </div>
            </div>

            {/* Club Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold mb-4 dark:text-primary">{club?.title}</h2>
                <p className="text-lg text-muted-foreground mb-6 dark:text-muted-foreground">
                  {club?.description}
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <StarRatingComponent rating={averageReview} />
                    </div>
                    <span className="text-muted-foreground">
                      ({(averageReview || 0).toFixed(2)} - {reviews?.length || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    <span className="text-sm">Host: {club?.host_id?.name}</span>
                  </div>
                </div>
              </div>

              {/* Host Information */}
              <div className="bg-gray-50 rounded-xl p-6 dark:bg-card">
                <h3 className="text-xl font-semibold mb-4 dark:text-primary">Your Host</h3>
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    {club?.host_id?.image ? (
                      <img 
                        src={club?.host_id?.image} 
                        alt={club?.host_id?.name || "Host"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <AvatarFallback style={{ display: club?.host_id?.image ? 'none' : 'flex' }} className="text-lg">
                      {club?.host_id?.name?.[0]?.toUpperCase() || 'H'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg dark:text-primary">{club?.host_id?.name}</h4>
                      <div className="flex items-center gap-1">
                        <ShieldIcon className="h-4 w-4 text-blue-600" />
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Verified Host</Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2 dark:text-muted-foreground">{club?.host_id?.title}</p>
                    <p className="text-sm mb-2 dark:text-foreground">{club?.host_id?.bio}</p>
                    {club?.host_id?.experience && (
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                        <strong>Background:</strong> {club?.host_id?.experience}
                      </p>
                    )}
                    {club?.host_id?.languages && (
                      <p className="text-sm text-muted-foreground mt-1 dark:text-muted-foreground">
                        <strong>Languages:</strong> {club?.host_id?.languages}
                      </p>
                    )}
                    
                    {/* Host Stats */}
                    {(club?.host_id?.events_hosted > 0 || club?.host_id?.total_guests > 0 || club?.host_id?.years_experience > 0) && (
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t dark:border-border">
                        {club?.host_id?.events_hosted > 0 && (
                          <div className="text-center">
                            <div className="font-semibold text-lg dark:text-primary">{club?.host_id?.events_hosted}</div>
                            <div className="text-xs text-muted-foreground dark:text-muted-foreground">Events Hosted</div>
                          </div>
                        )}
                        {club?.host_id?.total_guests > 0 && (
                          <div className="text-center">
                            <div className="font-semibold text-lg dark:text-primary">{club?.host_id?.total_guests}</div>
                            <div className="text-xs text-muted-foreground dark:text-muted-foreground">Total Guests</div>
                          </div>
                        )}
                        {club?.host_id?.years_experience > 0 && (
                          <div className="text-center">
                            <div className="font-semibold text-lg dark:text-primary">{club?.host_id?.years_experience}</div>
                            <div className="text-xs text-muted-foreground dark:text-muted-foreground">Years Experience</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Host Awards */}
              {club?.host_id?.awards && club?.host_id?.awards.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-primary">Awards & Recognition</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 dark:bg-yellow-950/30 dark:border-yellow-900/50">
                    <div className="flex items-start gap-3">
                      <AwardIcon className="h-5 w-5 text-yellow-600 mt-1 dark:text-yellow-500" />
                      <div>
                        <ul className="space-y-1">
                          {club?.host_id?.awards.map((award, index) => (
                            <li key={index} className="text-sm font-medium dark:text-yellow-200">{award}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 dark:bg-card">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-primary">
                    <CalendarIcon className="h-5 w-5" />
                    Event Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium dark:text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">{selectedSchedule?.duration || club?.default_duration || "2-3 hours"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium dark:text-foreground">Group Size</p>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                          {selectedSchedule?.seat_limit ? `${selectedSchedule.seat_limit} guests` : club?.default_group_size || "2-8 guests"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium dark:text-foreground">Location</p>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                          {club?.location?.address || club?.default_location_description || "Private residence - details provided after booking"}
                        </p>
                        {club?.location?.neighborhood && (
                          <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                            {club?.location?.neighborhood}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 dark:bg-card">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-primary">
                    <UtensilsIcon className="h-5 w-5" />
                    Experience Type
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getExperienceTypeColor(club?.experience_type)} text-white`}>
                        {experienceTypeLabels[club?.experience_type]}
                      </Badge>
                      {club?.is_members_only && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          Members Only
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <WineIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {club?.includes_alcohol ? "Alcohol included" : "Alcohol not included"}
                        </span>
                      </div>
                      {club?.cuisine_type && (
                        <div className="flex items-center gap-2">
                          <UtensilsIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{club?.cuisine_type} cuisine</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              {club?.whats_included && club?.whats_included.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-primary">What's Included</h3>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 dark:bg-green-950/30 dark:border-green-900/50">
                    <ul className="space-y-2">
                      {club?.whats_included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0 dark:text-green-500" />
                          <span className="text-sm dark:text-green-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* What's Not Included */}
              {club?.whats_not_included && club?.whats_not_included.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-primary">What's Not Included</h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 dark:bg-red-950/30 dark:border-red-900/50">
                    <ul className="space-y-2">
                      {club?.whats_not_included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XIcon className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0 dark:text-red-500" />
                          <span className="text-sm dark:text-red-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Guest Requirements */}
              {club?.guest_requirements && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-primary">Guest Requirements</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 dark:bg-blue-950/30 dark:border-blue-900/50">
                    <p className="text-sm text-blue-800 dark:text-blue-200">{club?.guest_requirements}</p>
                  </div>
                </div>
              )}

              {/* Menu Details */}
              {club?.menu_details && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-primary">Menu Details</h3>
                  <div className="bg-gray-50 rounded-xl p-6 dark:bg-card">
                    <p className="text-muted-foreground dark:text-muted-foreground">{club?.menu_details}</p>
                  </div>
                </div>
              )}

              {/* Dietary Notes */}
              {club?.dietary_notes && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-primary">Dietary Accommodations</h3>
                  <div className="bg-gray-50 rounded-xl p-6 dark:bg-card">
                    <p className="text-muted-foreground dark:text-muted-foreground">{club?.dietary_notes}</p>
                  </div>
                </div>
              )}

              {/* Cancellation Policy */}
              {club?.cancellation_policy && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-primary">Cancellation Policy</h3>
                  <div className="bg-gray-50 rounded-xl p-6 dark:bg-card">
                    <p className="text-muted-foreground dark:text-muted-foreground">{club?.cancellation_policy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white border rounded-xl p-6 sticky top-24 dark:bg-card dark:border-border">
              <h3 className="text-xl font-semibold mb-4 dark:text-primary">Book This Experience</h3>

              {/* Event Schedules */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 dark:text-foreground">Select Date</h4>
                {schedules && schedules.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedSchedule?._id === schedule._id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 dark:bg-primary/10"
                            : "hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-muted dark:border-border"
                        }`}
                        onClick={() => setSelectedSchedule(schedule)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span className="font-medium dark:text-foreground">
                                {new Date(schedule.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ClockIcon className="h-4 w-4" />
                              <span>{schedule.start_time}</span>
                              <span>•</span>
                              <span>{schedule.duration || club?.default_duration || "2-3 hours"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <UsersIcon className="h-4 w-4" />
                              <span className={
                                (schedule.seat_limit - schedule.seats_booked) <= 2 
                                  ? "text-orange-600 font-medium" 
                                  : "text-muted-foreground"
                              }>
                                {schedule.seat_limit - schedule.seats_booked} seats available
                              </span>
                              {schedule.seat_limit - schedule.seats_booked <= 2 && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">
                                  Limited spots
                                </Badge>
                              )}
                            </div>
                            {schedule.menu_notes && (
                              <p className="text-xs text-muted-foreground italic">
                                {schedule.menu_notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <DollarSignIcon className="h-4 w-4" />
                              <span className="font-semibold text-lg">
                                ${schedule.price_per_guest}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">per guest</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No upcoming dates scheduled</p>
                    <p className="text-sm text-muted-foreground mt-1">Please check back later</p>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              {selectedSchedule && (
                <div className="border-t pt-4 mb-6 dark:border-border">
                  <div className="flex justify-between items-center mb-2 dark:text-muted-foreground">
                    <span className="text-sm">Price per guest</span>
                    <span className="font-medium">${selectedSchedule.price_per_guest}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg dark:text-primary">
                    <span>Total</span>
                    <span>${selectedSchedule.price_per_guest}</span>
                  </div>
                </div>
              )}

              {/* Booking Button */}
              {selectedSchedule ? (
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={selectedSchedule.seat_limit - selectedSchedule.seats_booked === 0}
                  >
                    {selectedSchedule.seat_limit - selectedSchedule.seats_booked === 0
                      ? "Sold Out"
                      : "Book Now"}
                  </Button>
                  
                  {/* Booking Confirmation Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950/30 dark:border-blue-900/50">
                    <h4 className="font-semibold text-blue-900 mb-2 dark:text-blue-100">Your booking will be instantly confirmed</h4>
                    <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1 dark:text-green-400">✓</span>
                        <span>We'll send you a confirmation email with a recap of your upcoming experience. Check your inbox!</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1 dark:text-green-400">✓</span>
                        <span>If you have any dietary requirements or comments, you can send the host a message on the next page.</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Trust & Safety */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-950/30 dark:border-yellow-900/50">
                    <h4 className="font-semibold text-yellow-900 mb-2 dark:text-yellow-100">Trust & Safety</h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      We are committed to the health and well-being of our community. Learn more about our enhanced safety measures and flexible booking policies.
                    </p>
                    <button className="text-blue-600 text-sm underline mt-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Learn more
                    </button>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled
                >
                  Select a date to book
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Separator className="my-12" />
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 dark:text-primary">Reviews</h2>
          <div className="grid gap-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <div className="flex gap-4 border-b pb-6" key={reviewItem._id}>
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>{reviewItem.userName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium dark:text-primary">{reviewItem.userName}</span>
                      <StarRatingComponent rating={reviewItem.reviewValue} />
                    </div>
                    <p className="text-muted-foreground dark:text-muted-foreground">{reviewItem.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review this experience!</p>
            )}
          </div>

          {/* Add Review Section */}
          {user ? (
            <div className="mt-8 border-t pt-8">
              <h3 className="text-xl font-semibold mb-4 dark:text-primary">Add Your Review</h3>
              <div className="space-y-4">
                <div>
                  <Label className="dark:text-primary">Rating</Label>
                  <StarRatingComponent 
                    rating={rating} 
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <div>
                  <Label htmlFor="reviewMessage" className="dark:text-primary">Your Review</Label>
                  <Input
                    id="reviewMessage"
                    value={reviewMsg}
                    name="reviewMsg"
                    placeholder="Share your experience..."
                    onChange={(event) => setReviewMsg(event.target.value)}
                    className="dark:bg-card dark:text-foreground dark:border-border"
                  />
                </div>
                <Button 
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim().length < 3 || rating === 0}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 border-t pt-8 text-center">
              <p className="text-muted-foreground">Please log in to add a review</p>
            </div>
          )}

          {/* Similar Experiences */}
          <Separator className="my-12" />
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 dark:text-primary">Similar Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* This would be populated with similar clubs - for now showing placeholder */}
              <div className="border rounded-lg p-4 text-center text-muted-foreground dark:border-border dark:text-muted-foreground">
                <div className="h-32 bg-gray-100 rounded mb-4 dark:bg-muted"></div>
                <p>Similar experiences will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubDetailsPage;

import { StarIcon, CalendarIcon, UsersIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { setClubDetails } from "@/store/shop/clubs-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addClubReview, getClubReviews } from "@/store/shop/clubs-slice";
import { Badge } from "../ui/badge";

function ClubDetailsDialog({ open, setOpen, clubDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopClubs);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setClubDetails());
    setRating(0);
    setReviewMsg("");
    setSelectedSchedule(null);
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
        dispatch(getClubReviews(clubDetails?.club?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (clubDetails?.club?._id) {
      dispatch(getClubReviews(clubDetails?.club?._id));
      // Set first schedule as default
      if (clubDetails?.schedules?.length > 0) {
        setSelectedSchedule(clubDetails.schedules[0]);
      }
    }
  }, [clubDetails, dispatch]);

  const experienceTypeLabels = {
    SUPPER_CLUB: "Supper Club",
    CHEFS_TABLE: "Chef's Table",
    WINE_TASTING: "Wine Tasting",
    MASTERCLASS: "Masterclass",
    FARM_TO_TABLE: "Farm to Table",
  };

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + (reviewItem.review_value || 0), 0) / reviews.length
      : 0;

  if (!clubDetails || !clubDetails.club) {
    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading club details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { club, schedules } = clubDetails;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={club?.images?.[0] || "/placeholder-club.jpg"}
                alt={club?.title || "Club image"}
                className="w-full h-[300px] object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-club.jpg";
                }}
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-extrabold mb-2">{club?.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-purple-500 hover:bg-purple-600">
                  {experienceTypeLabels[club?.experience_type]}
                </Badge>
                {club?.is_members_only && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    Members Only
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg mb-4">
                {club?.description}
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-muted-foreground">
                  ({(averageReview || 0).toFixed(2)} - {reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Host, Schedule, and Booking */}
          <div className="space-y-6">
            {/* Host Information */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Your Host</h3>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
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
                  <AvatarFallback style={{ display: club?.host_id?.image ? 'none' : 'flex' }}>
                    {club?.host_id?.name?.[0]?.toUpperCase() || 'H'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{club?.host_id?.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {club?.host_id?.title}
                  </p>
                  <p className="text-sm">{club?.host_id?.bio}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Menu Details */}
            {club?.menu_details && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Menu Details</h3>
                <p className="text-sm text-muted-foreground">
                  {club?.menu_details}
                </p>
              </div>
            )}

            {/* Event Schedules */}
            {schedules && schedules.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold mb-3">Available Dates</h3>
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedSchedule?._id === schedule._id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedSchedule(schedule)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="font-medium">
                              {new Date(schedule.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ClockIcon className="h-4 w-4" />
                            <span>{schedule.start_time}</span>
                            <span>•</span>
                            <span>{schedule.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UsersIcon className="h-4 w-4" />
                            <span>{schedule.seat_limit - schedule.seats_booked} seats available</span>
                          </div>
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
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-3">Available Dates</h3>
                <p className="text-muted-foreground">No upcoming dates scheduled. Please check back later.</p>
              </div>
            )}

            {/* Cancellation Policy */}
            {club?.cancellation_policy && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Cancellation Policy</h3>
                <p className="text-sm text-muted-foreground">
                  {club?.cancellation_policy}
                </p>
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Your booking will be instantly confirmed</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>We'll send you a confirmation email with a recap of your upcoming experience. Check your inbox!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>If you have any dietary requirements or comments, you can send the host a message on the next page.</span>
                    </li>
                  </ul>
                </div>
                
                {/* Trust & Safety */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Trust & Safety</h4>
                  <p className="text-sm text-yellow-800">
                    We are committed to the health and well-being of our community. Learn more about our enhanced safety measures and flexible booking policies.
                  </p>
                  <button className="text-blue-600 text-sm underline mt-2 hover:text-blue-800">
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

        {/* Reviews Section */}
        <Separator className="my-6" />
        <div className="max-h-[400px] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="grid gap-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <div className="flex gap-4" key={reviewItem._id}>
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>
                      {reviewItem?.user_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{reviewItem?.user_name}</h3>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <StarRatingComponent rating={reviewItem?.review_value} />
                    </div>
                    <p className="text-muted-foreground">
                      {reviewItem.review_message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <h1>No Reviews</h1>
            )}
          </div>
          <div className="mt-10 flex-col flex gap-2">
            <Label>Write a review</Label>
            <div className="flex gap-1">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(event) => setReviewMsg(event.target.value)}
              placeholder="Write a review..."
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === "" || rating === 0}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClubDetailsDialog;

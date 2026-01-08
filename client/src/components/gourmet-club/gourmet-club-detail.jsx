import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  ChefHat,
  Phone,
  Mail,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Heart,
  Share2,
  Badge as BadgeIcon,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import EventBookingModal from "./event-booking-modal";

const GourmetClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      const response = await fetch(`/api/gourmet-clubs/${id}`);
      const data = await response.json();

      if (response.ok) {
        setClub(data);
        // Set the first upcoming event as default
        if (data.upcomingEvents && data.upcomingEvents.length > 0) {
          setSelectedEvent(data.upcomingEvents[0]);
        }
      } else {
        console.error("Error fetching club details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching club details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExperienceTypeLabel = (type) => {
    const types = {
      "monthly-supper-club": "Monthly Supper Club",
      "chefs-table": "Chef's Table",
      "wine-tasting": "Wine Tasting",
      "cooking-masterclass": "Cooking Masterclass",
      "farm-to-table": "Farm to Table",
      "members-exclusive": "Members Exclusive",
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleBookNow = (event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: club.name,
          text: club.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-96 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-200 h-32 rounded-lg"></div>
                <div className="bg-gray-200 h-48 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
                <div className="bg-gray-200 h-48 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Club not found</h2>
          <Button onClick={() => navigate("/gourmet-clubs")}>
            Back to Clubs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={club.image || "/placeholder-restaurant.jpg"}
          alt={club.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-white text-gray-900">
                {getExperienceTypeLabel(club.experienceType)}
              </Badge>
              {club.featured && (
                <Badge className="bg-orange-500">Featured</Badge>
              )}
              {club.isMembersOnly && (
                <Badge className="bg-purple-500">Members Only</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2">{club.name}</h1>
            <p className="text-xl text-white/90 mb-4">{club.theme}</p>
            
            <div className="flex items-center space-x-6 text-white">
              {club.rating?.average > 0 && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span>{club.rating.average.toFixed(1)}</span>
                  <span className="text-white/70 ml-1">({club.rating.count} reviews)</span>
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{club.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-1" />
                <span>Up to {club.maxSeats} guests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{club.description}</p>
                
                {club.tags && club.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {club.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Menu */}
            <Card>
              <CardHeader>
                <CardTitle>Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: club.menu }} />
                </div>
                
                {club.winePairing?.included && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">Wine Pairing Included</h4>
                    <p className="text-amber-800">{club.winePairing.description}</p>
                    {club.winePairing.additionalCost > 0 && (
                      <p className="text-amber-700 mt-2">
                        Additional cost: €{club.winePairing.additionalCost}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dietary Information */}
            {club.dietaryNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Dietary Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{club.dietaryNotes}</p>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {club.reviews && club.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {club.reviews.map((review) => (
                      <div key={review._id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <Avatar className="w-8 h-8 mr-3">
                            <AvatarFallback>
                              {review.user?.userName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{review.user?.userName}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating?.overall
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Host Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Your Host
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={club.host?.image} />
                    <AvatarFallback>
                      {club.host?.name?.charAt(0) || "H"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{club.host?.name}</h3>
                    <p className="text-gray-600">{club.host?.title}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{club.host?.bio}</p>
                
                {club.host?.specializations && club.host.specializations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-1">
                      {club.host.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {club.host?.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {club.host.email}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {club.host?.socialLinks?.instagram && (
                      <a
                        href={club.host.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {club.host?.socialLinks?.twitter && (
                      <a
                        href={club.host.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {club.host?.socialLinks?.linkedin && (
                      <a
                        href={club.host.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {club.upcomingEvents && club.upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {club.upcomingEvents.map((event) => (
                      <div
                        key={event._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedEvent?._id === event._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(event.date)}
                            </p>
                          </div>
                          {event.instantBooking && (
                            <Badge className="bg-green-500 text-xs">Instant Booking</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {event.availableSeats || event.totalSeats} seats left
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-semibold text-lg">€{event.pricePerSeat}</span>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookNow(event);
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No upcoming events</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedEvent && (
        <EventBookingModal
          event={selectedEvent}
          club={club}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default GourmetClubDetail;

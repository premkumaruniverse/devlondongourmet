import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Users, Clock, Star, MapPin, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const experienceTypes = [
  { value: "monthly-supper-club", label: "Monthly Supper Club" },
  { value: "chefs-table", label: "Chef's Table" },
  { value: "wine-tasting", label: "Wine Tasting" },
  { value: "cooking-masterclass", label: "Cooking Masterclass" },
  { value: "farm-to-table", label: "Farm to Table" },
  { value: "members-exclusive", label: "Members Exclusive" },
];

const GourmetClubListing = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    experienceType: "",
    priceMin: "",
    priceMax: "",
    featured: "",
    membersOnly: "",
    date: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, [filters, pagination.currentPage]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await fetch(`/api/gourmet-clubs?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setClubs(data.clubs);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          total: data.total,
        });
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const getExperienceTypeLabel = (type) => {
    return experienceTypes.find(t => t.value === type)?.label || type;
  };

  const getNextEventDate = (upcomingEvents) => {
    if (!upcomingEvents || upcomingEvents.length === 0) return null;
    const nextEvent = upcomingEvents[0];
    return new Date(nextEvent.date);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gourmet Clubs</h1>
              <p className="mt-2 text-gray-600">
                Discover exclusive culinary experiences with world-class chefs
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 md:mt-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search clubs, themes, or keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <Select
                  value={filters.experienceType}
                  onValueChange={(value) => handleFilterChange("experienceType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {experienceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.membersOnly}
                  onValueChange={(value) => handleFilterChange("membersOnly", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Events</SelectItem>
                    <SelectItem value="false">Public Events</SelectItem>
                    <SelectItem value="true">Members Only</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.featured}
                  onValueChange={(value) => handleFilterChange("featured", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Events</SelectItem>
                    <SelectItem value="true">Featured Only</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {clubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No clubs found</div>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {clubs.length} of {pagination.total} clubs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => {
                const nextEvent = getNextEventDate(club.upcomingEvents);
                const nextEventDetails = club.upcomingEvents?.[0];

                return (
                  <Card key={club._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <img
                          src={club.image || "/placeholder-restaurant.jpg"}
                          alt={club.name}
                          className="w-full h-48 object-cover"
                        />
                        {club.featured && (
                          <Badge className="absolute top-3 left-3 bg-orange-500">
                            Featured
                          </Badge>
                        )}
                        {club.isMembersOnly && (
                          <Badge className="absolute top-3 right-3 bg-purple-500">
                            Members Only
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Badge variant="secondary" className="text-xs mb-2">
                            {getExperienceTypeLabel(club.experienceType)}
                          </Badge>
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                            {club.name}
                          </h3>
                        </div>
                        {club.rating?.average > 0 && (
                          <div className="flex items-center ml-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {club.rating.average.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {club.description}
                      </p>

                      <div className="flex items-center mb-3">
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarImage src={club.host?.image} />
                          <AvatarFallback>
                            {club.host?.name?.charAt(0) || "H"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">{club.host?.name}</span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {club.location}
                        </div>

                        {nextEvent && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(nextEvent)}
                            {nextEventDetails && (
                              <span className="ml-2">
                                {formatTime(nextEventDetails.startTime)}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Up to {club.maxSeats} guests
                        </div>

                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {club.duration} hours
                        </div>
                      </div>

                      {club.tags && club.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {club.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {club.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{club.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            €{club.pricePerSeat}
                          </div>
                          <div className="text-xs text-gray-500">per guest</div>
                        </div>
                        <Button
                          onClick={() => {
                            // Navigate to club detail page
                            window.location.href = `/gourmet-clubs/${club._id}`;
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ 
                    ...prev, 
                    currentPage: Math.max(1, prev.currentPage - 1) 
                  }))}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === pagination.currentPage;
                  const isNearCurrent = Math.abs(page - pagination.currentPage) <= 2;
                  const isAtStart = page <= 2;
                  const isAtEnd = page >= pagination.totalPages - 1;

                  if (isCurrentPage || isNearCurrent || isAtStart || isAtEnd) {
                    return (
                      <Button
                        key={page}
                        variant={isCurrentPage ? "default" : "outline"}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                      >
                        {page}
                      </Button>
                    );
                  }

                  if (page === 3 || page === pagination.totalPages - 2) {
                    return <span key={page} className="px-2">...</span>;
                  }

                  return null;
                })}

                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ 
                    ...prev, 
                    currentPage: Math.min(pagination.totalPages, prev.currentPage + 1) 
                  }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GourmetClubListing;

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Calendar, Users, Star, MapPin, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import GourmetClubForm from "./gourmet-club-form";

const AdminGourmetClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    experienceType: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [selectedClub, setSelectedClub] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, [filters, pagination.currentPage]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await fetch(`/api/gourmet-clubs?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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

  const handleDelete = async (clubId) => {
    if (!confirm("Are you sure you want to delete this club?")) return;

    try {
      const response = await fetch(`/api/gourmet-clubs/${clubId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setClubs(clubs.filter(club => club._id !== clubId));
        alert("Club deleted successfully");
      } else {
        const errorText = await response.text();
        try {
          const data = JSON.parse(errorText);
          alert(data.message || "Failed to delete club");
        } catch {
          alert("Failed to delete club");
        }
      }
    } catch (error) {
      console.error("Error deleting club:", error);
      alert("Error deleting club");
    }
  };

  const handleEdit = (club) => {
    setSelectedClub(club);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedClub(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedClub(null);
    fetchClubs();
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

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      approved: "bg-blue-100 text-blue-800",
      live: "bg-green-100 text-green-800",
      "fully-booked": "bg-yellow-100 text-yellow-800",
      completed: "bg-purple-100 text-purple-800",
      archived: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gourmet Clubs</h1>
          <p className="text-gray-600 mt-1">Manage culinary experiences and events</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Club
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search clubs..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="fully-booked">Fully Booked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.experienceType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, experienceType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Types</SelectItem>
                <SelectItem value="monthly-supper-club">Monthly Supper Club</SelectItem>
                <SelectItem value="chefs-table">Chef's Table</SelectItem>
                <SelectItem value="wine-tasting">Wine Tasting</SelectItem>
                <SelectItem value="cooking-masterclass">Cooking Masterclass</SelectItem>
                <SelectItem value="farm-to-table">Farm to Table</SelectItem>
                <SelectItem value="members-exclusive">Members Exclusive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setFilters({ status: "", experienceType: "", search: "" })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clubs</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Live Events</p>
                <p className="text-2xl font-bold">
                  {clubs.filter(club => club.status === "live").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">
                  {clubs.filter(club => club.status === "approved").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {clubs.length > 0
                    ? (clubs.reduce((sum, club) => sum + (club.rating?.average || 0), 0) / clubs.length).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clubs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clubs ({clubs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Club</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.map((club) => (
                <TableRow key={club._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={club.image || "/placeholder-restaurant.jpg"}
                        alt={club.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{club.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {club.location}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <span>{club.host?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getExperienceTypeLabel(club.experienceType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(club.status)}>
                      {club.status}
                    </Badge>
                  </TableCell>
                  <TableCell>€{club.pricePerSeat}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {club.rating?.average?.toFixed(1) || "N/A"}
                      {club.rating?.count > 0 && (
                        <span className="text-gray-500 text-sm ml-1">
                          ({club.rating.count})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(club.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/gourmet-clubs/${club._id}`, "_blank")}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(club)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(club._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
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
                return (
                  <Button
                    key={page}
                    variant={page === pagination.currentPage ? "default" : "outline"}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                  >
                    {page}
                  </Button>
                );
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
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" description="Gourmet club management form">
          <DialogHeader>
            <DialogTitle>
              {selectedClub ? "Edit Club" : "Create New Club"}
            </DialogTitle>
          </DialogHeader>
          <GourmetClubForm
            club={selectedClub}
            onClose={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGourmetClubs;

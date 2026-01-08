import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { X, Plus, Trash2 } from "lucide-react";
import ProductImageUpload from "@/components/admin-view/image-upload";

const GourmetClubForm = ({ club, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    theme: "",
    experienceType: "",
    tags: [],
    maxSeats: 10,
    pricePerSeat: 50,
    duration: 2,
    location: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
    cancellationPolicy: "moderate",
    cancellationHours: 48,
    dietaryNotes: "",
    menu: "",
    winePairing: {
      included: false,
      description: "",
      additionalCost: 0,
    },
    isMembersOnly: false,
    featured: false,
    recurring: {
      isRecurring: false,
      frequency: "",
      endDate: "",
    },
    host: "",
    newHostName: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (club) {
      setFormData({
        ...club,
        tags: club.tags || [],
        address: club.address || {
          street: "",
          city: "",
          postalCode: "",
          country: "",
        },
        winePairing: club.winePairing || {
          included: false,
          description: "",
          additionalCost: 0,
        },
        recurring: club.recurring || {
          isRecurring: false,
          frequency: "",
          endDate: "",
        },
      });
      setUploadedImageUrl(club.image || "");
    }
    fetchHosts();
  }, [club]);

  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  const fetchHosts = async () => {
    try {
      const response = await fetch("/api/gourmet-clubs/hosts");
      const data = await response.json();
      
      if (response.ok && data.success) {
        setHosts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleWinePairingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      winePairing: { ...prev.winePairing, [field]: value },
    }));
  };

  const handleRecurringChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      recurring: { ...prev.recurring, [field]: value },
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Handle host field - if new host name is provided, use it, otherwise use selected host
      const hostValue = formData.newHostName ? formData.newHostName : formData.host;
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === "address" || key === "winePairing" || key === "recurring") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "tags") {
          formDataToSend.append(key, formData[key].join(","));
        } else if (key === "newHostName") {
          // Skip newHostName as it's handled separately
        } else if (key === "image") {
          // Skip image here, we'll add it as a file below
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add image file if available
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const url = club ? `/api/gourmet-clubs/${club._id}` : "/api/gourmet-clubs";
      const method = club ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        alert(club ? "Club updated successfully!" : "Club created successfully!");
        onClose();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to save club");
      }
    } catch (error) {
      console.error("Error saving club:", error);
      alert("Error saving club");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Policy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Club Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="host">Host *</Label>
              <div className="space-y-2">
                <Select
                  value={formData.host}
                  onValueChange={(value) => handleInputChange("host", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select existing host or type new host name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>-- Type new host name --</SelectItem>
                    {hosts.map((host) => (
                      <SelectItem key={host._id} value={host._id}>
                        {host.name} - {host.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.host === null && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter new host name"
                      value={formData.newHostName || ""}
                      onChange={(e) => handleInputChange("newHostName", e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: A new host profile will be created. You can edit full details later in Host Management.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="theme">Theme *</Label>
              <Input
                id="theme"
                value={formData.theme}
                onChange={(e) => handleInputChange("theme", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="experienceType">Experience Type *</Label>
              <Select
                value={formData.experienceType}
                onValueChange={(value) => handleInputChange("experienceType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly-supper-club">Monthly Supper Club</SelectItem>
                  <SelectItem value="chefs-table">Chef's Table</SelectItem>
                  <SelectItem value="wine-tasting">Wine Tasting</SelectItem>
                  <SelectItem value="cooking-masterclass">Cooking Masterclass</SelectItem>
                  <SelectItem value="farm-to-table">Farm to Table</SelectItem>
                  <SelectItem value="members-exclusive">Members Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="maxSeats">Maximum Seats *</Label>
              <Input
                id="maxSeats"
                type="number"
                min="1"
                value={formData.maxSeats}
                onChange={(e) => handleInputChange("maxSeats", parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Club Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  // For now, just set a placeholder URL
                  setUploadedImageUrl(URL.createObjectURL(file));
                }
              }}
            />
            {uploadedImageUrl && (
              <div className="mt-2">
                <img
                  src={uploadedImageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor="menu">Menu *</Label>
            <Textarea
              id="menu"
              value={formData.menu}
              onChange={(e) => handleInputChange("menu", e.target.value)}
              rows={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="dietaryNotes">Dietary Notes</Label>
            <Textarea
              id="dietaryNotes"
              value={formData.dietaryNotes}
              onChange={(e) => handleInputChange("dietaryNotes", e.target.value)}
              rows={3}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Wine Pairing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="winePairingIncluded"
                  checked={formData.winePairing.included}
                  onCheckedChange={(checked) => 
                    handleWinePairingChange("included", checked)
                  }
                />
                <Label htmlFor="winePairingIncluded">Wine pairing included</Label>
              </div>

              {formData.winePairing.included && (
                <>
                  <div>
                    <Label htmlFor="winePairingDescription">Description</Label>
                    <Textarea
                      id="winePairingDescription"
                      value={formData.winePairing.description}
                      onChange={(e) => 
                        handleWinePairingChange("description", e.target.value)
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="winePairingCost">Additional Cost</Label>
                    <Input
                      id="winePairingCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.winePairing.additionalCost}
                      onChange={(e) => 
                        handleWinePairingChange("additionalCost", parseFloat(e.target.value))
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (hours) *</Label>
              <Input
                id="duration"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", parseFloat(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="pricePerSeat">Price per Seat (€) *</Label>
              <Input
                id="pricePerSeat"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerSeat}
                onChange={(e) => handleInputChange("pricePerSeat", parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.address.postalCode}
                    onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cancellationPolicy">Policy Type</Label>
                <Select
                  value={formData.cancellationPolicy}
                  onValueChange={(value) => handleInputChange("cancellationPolicy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible (24 hours)</SelectItem>
                    <SelectItem value="moderate">Moderate (48 hours)</SelectItem>
                    <SelectItem value="strict">Strict (72 hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cancellationHours">Cancellation Notice (hours)</Label>
                <Input
                  id="cancellationHours"
                  type="number"
                  min="1"
                  value={formData.cancellationHours}
                  onChange={(e) => handleInputChange("cancellationHours", parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isMembersOnly"
                checked={formData.isMembersOnly}
                onCheckedChange={(checked) => handleInputChange("isMembersOnly", checked)}
              />
              <Label htmlFor="isMembersOnly">Members Only</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
              />
              <Label htmlFor="featured">Featured Club</Label>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recurring Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={formData.recurring.isRecurring}
                  onCheckedChange={(checked) => handleRecurringChange("isRecurring", checked)}
                />
                <Label htmlFor="isRecurring">Recurring Club</Label>
              </div>

              {formData.recurring.isRecurring && (
                <>
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={formData.recurring.frequency}
                      onValueChange={(value) => handleRecurringChange("frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.recurring.endDate}
                      onChange={(e) => handleRecurringChange("endDate", e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : club ? "Update Club" : "Create Club"}
        </Button>
      </div>
    </form>
  );
};

export default GourmetClubForm;

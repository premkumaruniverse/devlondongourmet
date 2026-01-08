import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Star, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const HostManagement = () => {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    image: "",
    experience: "",
    bio: "",
    bestAdvice: "",
    memberships: [],
    recognition: [],
    specializations: [],
    email: "",
    socialLinks: {
      linkedin: "",
      instagram: "",
      twitter: "",
    },
    isActive: true,
    order: 0,
  });
  const [membershipInput, setMembershipInput] = useState("");
  const [recognitionInput, setRecognitionInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("");

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      const response = await fetch("/api/admin/chefs/get");
      const data = await response.json();
      
      if (response.ok) {
        setHosts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedHost ? `/api/admin/chefs/edit/${selectedHost._id}` : "/api/admin/chefs/add";
      const method = selectedHost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(selectedHost ? "Host updated successfully!" : "Host created successfully!");
        setIsFormOpen(false);
        resetForm();
        fetchHosts();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to save host");
      }
    } catch (error) {
      console.error("Error saving host:", error);
      alert("Error saving host");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hostId) => {
    if (!confirm("Are you sure you want to delete this host?")) return;

    try {
      const response = await fetch(`/api/admin/chefs/delete/${hostId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHosts(hosts.filter(host => host._id !== hostId));
        alert("Host deleted successfully");
      } else {
        alert("Failed to delete host");
      }
    } catch (error) {
      console.error("Error deleting host:", error);
      alert("Error deleting host");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      image: "",
      experience: "",
      bio: "",
      bestAdvice: "",
      memberships: [],
      recognition: [],
      specializations: [],
      email: "",
      socialLinks: {
        linkedin: "",
        instagram: "",
        twitter: "",
      },
      isActive: true,
      order: 0,
    });
    setSelectedHost(null);
  };

  const handleEdit = (host) => {
    setSelectedHost(host);
    setFormData(host);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const addArrayItem = (field, value) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item),
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold">Host Management</h1>
          <p className="text-gray-600 mt-1">Manage your culinary hosts and chefs</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Host
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hosts.map((host) => (
          <Card key={host._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={host.image || "/placeholder-avatar.jpg"}
                  alt={host.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{host.name}</CardTitle>
                  <p className="text-sm text-gray-600">{host.title}</p>
                  <Badge variant={host.isActive ? "default" : "secondary"}>
                    {host.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {host.experience && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    {host.experience}
                  </div>
                )}
                
                {host.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {host.email}
                  </div>
                )}

                {host.specializations && host.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {host.specializations.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {host.specializations.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{host.specializations.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {host.socialLinks && (
                  <div className="flex space-x-2">
                    {host.socialLinks.linkedin && (
                      <a
                        href={host.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {host.socialLinks.instagram && (
                      <a
                        href={host.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                <div className="flex space-x-2 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(host)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(host._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" description="Host management form">
          <DialogHeader>
            <DialogTitle>
              {selectedHost ? "Edit Host" : "Add New Host"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Profile Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="bestAdvice">Best Advice</Label>
              <Textarea
                id="bestAdvice"
                value={formData.bestAdvice}
                onChange={(e) => setFormData(prev => ({ ...prev, bestAdvice: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Memberships</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={membershipInput}
                    onChange={(e) => setMembershipInput(e.target.value)}
                    placeholder="Add membership"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("memberships", membershipInput))}
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem("memberships", membershipInput)}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.memberships.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("memberships", item)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Recognition</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={recognitionInput}
                    onChange={(e) => setRecognitionInput(e.target.value)}
                    placeholder="Add recognition"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("recognition", recognitionInput))}
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem("recognition", recognitionInput)}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.recognition.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("recognition", item)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Specializations</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={specializationInput}
                    onChange={(e) => setSpecializationInput(e.target.value)}
                    placeholder="Add specialization"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("specializations", specializationInput))}
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem("specializations", specializationInput)}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.specializations.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("specializations", item)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label>Social Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active Host</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : selectedHost ? "Update Host" : "Create Host"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostManagement;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from './components/data-table';
import { columns } from './components/banner-columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/use-auth';

const BannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const { getToken } = useAuth();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      link: '',
      buttonText: 'Shop Now',
      order: 0,
      isActive: true,
      image: null
    }
  });

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/banners');
      const data = await response.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch banners');
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      form.setValue('image', file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      // Append all form fields to formData
      Object.keys(data).forEach(key => {
        if (key === 'image' && data[key]) {
          formData.append('image', data[key]);
        } else if (key !== 'image') {
          formData.append(key, data[key]);
        }
      });

      const method = selectedBanner ? 'PUT' : 'POST';
      const url = selectedBanner 
        ? `/api/admin/banners/${selectedBanner._id}`
        : '/api/admin/banners';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        toast.success(selectedBanner ? 'Banner updated successfully' : 'Banner created successfully');
        fetchBanners();
        handleCloseDialog();
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save banner');
      console.error('Error saving banner:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete banner
  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Banner deleted successfully');
        fetchBanners();
      } else {
        throw new Error(result.message || 'Failed to delete banner');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete banner');
      console.error('Error deleting banner:', error);
    }
  };

  // Toggle banner status
  const toggleBannerStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Banner ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchBanners();
      } else {
        throw new Error(result.message || 'Failed to update banner status');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update banner status');
      console.error('Error toggling banner status:', error);
    }
  };

  // Open dialog for editing
  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    form.reset({
      title: banner.title,
      description: banner.description || '',
      link: banner.link || '',
      buttonText: banner.buttonText || 'Shop Now',
      order: banner.order || 0,
      isActive: banner.isActive,
      image: null
    });
    setPreviewImage(banner.image);
    setIsDialogOpen(true);
  };

  // Close dialog and reset form
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBanner(null);
    form.reset({
      title: '',
      description: '',
      link: '',
      buttonText: 'Shop Now',
      order: 0,
      isActive: true,
      image: null
    });
    setPreviewImage('');
  };

  // Prepare data for the table
  const tableData = banners.map(banner => ({
    ...banner,
    actions: (
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleBannerStatus(banner._id, banner.isActive)}
        >
          {banner.isActive ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-500" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleEditBanner(banner)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteBanner(banner._id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedBanner(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedBanner ? 'Edit Banner' : 'Add New Banner'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Banner title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Banner description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buttonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Shop Now" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Banner Image</FormLabel>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 ${
                        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="max-h-48 mx-auto mb-4 rounded"
                          />
                          <p className="text-sm text-gray-500">
                            Click to change or drag & drop a new image
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-500">
                            {isDragActive
                              ? 'Drop the image here...'
                              : 'Drag & drop an image here, or click to select'}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Recommended size: 1920x600px (JPG, PNG, WebP)
                          </p>
                        </div>
                      )}
                    </div>
                    {form.formState.errors.image && (
                      <p className="text-sm font-medium text-red-500">
                        {form.formState.errors.image.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {selectedBscriber ? 'Update' : 'Create'} Banner
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="sr-only">Loading...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No banners found. Create your first banner to get started.</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tableData}
            searchKey="title"
          />
        )}
      </div>
    </div>
  );
};

export default BannersPage;

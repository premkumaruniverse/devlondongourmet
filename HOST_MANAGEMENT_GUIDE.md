# Host Management Guide

## Overview
The Gourmet Club feature requires hosts (chefs) to be available for selection when creating clubs. This guide explains how to manage hosts effectively.

## What's Been Set Up

### 1. Sample Hosts Created
I've added 5 sample hosts to your database:
- **Chef Marco Rossi** - Italian Cuisine Expert
- **Chef Sarah Chen** - Pastry Chef & Chocolatier  
- **Chef James Mitchell** - Farm-to-Table Pioneer
- **Chef Elena Rodriguez** - Spanish Cuisine Expert
- **Chef David Kim** - Asian Fusion Specialist

### 2. Host Management System
- **Admin Panel**: `/admin/hosts` - Full CRUD operations for hosts
- **API Endpoint**: `/api/gourmet-clubs/hosts` - Gets active hosts for dropdown
- **Integration**: Hosts are automatically available in the gourmet club creation form

## How to Manage Hosts

### Access Host Management
1. Log in as admin
2. Navigate to **Admin Panel** → **Host Management** (or go to `/admin/hosts`)

### Add New Host
1. Click **"Add Host"** button
2. Fill in the required fields:
   - **Name** (required): Host's full name
   - **Title** (required): Professional title (e.g., "Executive Chef")
   - **Image** (required): Profile image URL
   - **Experience**: Years and type of experience
   - **Bio** (required): Professional biography
   - **Email**: Contact email
   - **Specializations**: Areas of expertise
   - **Social Links**: LinkedIn, Instagram, Twitter

### Edit Existing Host
1. Click the **Edit** icon on any host card
2. Modify the information
3. Click **"Update Host"**

### Delete Host
1. Click the **Delete** icon on any host card
2. Confirm the deletion

### Host Status
- **Active**: Host appears in dropdown selection
- **Inactive**: Host is hidden from selection but data is preserved

## Using Hosts in Gourmet Clubs

### When Creating a Club
1. Go to **Admin Panel** → **Gourmet Clubs** → **Create Club**
2. Select a host from the dropdown menu
3. Only **active hosts** will appear in the selection

### Host Information Display
- Host's profile image, name, and title appear in club listings
- Host details are shown on club detail pages
- Host bio and experience are displayed to users

## Best Practices

### Host Profiles
1. **Professional Images**: Use high-quality, professional headshots
2. **Complete Bios**: Include experience, training, and specialties
3. **Contact Info**: Add email and social media links
4. **Specializations**: List specific cuisines and techniques

### Host Organization
1. **Display Order**: Set order numbers to prioritize important hosts
2. **Active Status**: Deactivate hosts temporarily instead of deleting
3. **Regular Updates**: Keep host information current and relevant

### Image Guidelines
- Recommended size: 400x400 pixels
- Professional headshots preferred
- Consistent styling across all hosts
- Use high-resolution images

## API Integration

### Get Active Hosts
```javascript
// Used in gourmet club form
fetch('/api/gourmet-clubs/hosts')
  .then(response => response.json())
  .then(data => {
    // data.data contains array of active hosts
    setHosts(data.data);
  });
```

### Host Data Structure
```javascript
{
  _id: "host_id",
  name: "Chef Name",
  title: "Professional Title",
  image: "profile_image_url",
  experience: "Years of experience",
  bio: "Professional biography",
  specializations: ["Cuisine 1", "Cuisine 2"],
  email: "contact@email.com",
  socialLinks: {
    linkedin: "profile_url",
    instagram: "profile_url",
    twitter: "profile_url"
  },
  isActive: true,
  order: 1
}
```

## Troubleshooting

### Host Not Showing in Dropdown
1. Check if host is **active** (isActive: true)
2. Verify the API endpoint is working
3. Check browser console for errors

### Image Not Loading
1. Verify image URL is accessible
2. Check if image format is supported (jpg, png, webp)
3. Ensure image URL is HTTPS

### Host Management Not Loading
1. Check if you're logged in as admin
2. Verify the server is running
3. Check network connection

## Next Steps

1. **Review Sample Hosts**: Check the 5 sample hosts added to your database
2. **Customize Profiles**: Update host information to match your actual chefs
3. **Add Real Hosts**: Replace sample data with your actual chef profiles
4. **Test Integration**: Create a test gourmet club to verify host selection works

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the server is running without errors
3. Ensure you have admin privileges
4. Check that the database connection is working

The host management system is now fully integrated with your gourmet club feature! 🎉

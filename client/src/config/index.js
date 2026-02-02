export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "rubs-spice-mix", label: "Rubs & Spice Mix" },
      { id: "achar", label: "Achar" },
      { id: "rassa", label: "Rassa" },
      { id: "cured-coated", label: "Cured & Coated" },
    ],
  },
  {
    label: "Subcategory",
    name: "subcategory",
    componentType: "select",
    options: [
      // Will be populated dynamically based on category selection
    ],
    dependentOn: "category",
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const addServiceFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter service title",
  },
  {
    label: "Short Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter short description for list view",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
    submenu: [
      { id: "rubs_spices", label: "Rubs & Spice Mix", path: "/shop/listing?category=rubs_spices" },
      { id: "achar", label: "Achar", path: "/shop/listing?category=achar" },
      { id: "cured_coated", label: "Cured & Coated", path: "/shop/listing?category=cured_coated" },
      { id: "rassa", label: "Rassa", path: "/shop/listing?category=rassa" }
    ]
  },
  {
    id: "diners_atlas",
    label: "Diner's Atlas",
    path: "/shop/diners-atlas",
  },
  {
    id: "gourmet_club",
    label: "Gourmet Club",
    path: "/shop/gourmet-club",
  },
  {
    id: "ayu_bite",
    label: "Ayu Bite",
    path: "/shop/ayu-bite",
  },
  {
    id: "recipes",
    label: "Recipes & Blog",
    path: "/shop/recipes",
  },
  {
    id: "meet_our_team",
    label: "Meet Our Team",
    path: "/shop/meet-our-team",
  },
  {
    id: "contact_us",
    label: "Contact Us",
    path: "/shop/contact-us",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
    isIcon: true
  },
];

export const categoryOptionsMap = {
  'rubs-spice-mix': 'Rubs & Spice Mix',
  'achar': 'Achar',
  'rassa': 'Rassa',
  'cured-coated': 'Cured & Coated',
};

export const subcategoryOptionsMap = {
  'rubs-spice-mix': ['Spice Mix', 'Kebab Rubs'],
  'rassa': ['Gravies', 'Chutneys'],
  'cured-coated': ['Meats', 'Chicken', 'Sea Food']
};

export const filterOptions = {
  category: [
    { 
      id: "rubs-spice-mix", 
      label: "Rubs & Spice Mix",
      subcategories: [
        { id: "spice-mix", label: "Spice Mix" },
        { id: "kebab-rubs", label: "Kebab Rubs" }
      ]
    },
    { 
      id: "achar", 
      label: "Achar",
      subcategories: []
    },
    { 
      id: "rassa", 
      label: "Rassa",
      subcategories: [
        { id: "gravies", label: "Gravies" },
        { id: "chutneys", label: "Chutneys" }
      ]
    },
    { 
      id: "cured-coated", 
      label: "Cured & Coated",
      subcategories: [
        { id: "meats", label: "Meats" },
        { id: "chicken", label: "Chicken" },
        { id: "sea-food", label: "Sea Food" }
      ]
    },
  ]
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const clubSortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "date-soonest", label: "Date: Sooner First" },
  { id: "rating-highest", label: "Rating: Highest First" },
];

export const addClubFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter club title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter club description",
  },
  {
    label: "Experience Type",
    name: "experience_type",
    componentType: "select",
    options: [
      { id: "SUPPER_CLUB", label: "Supper Club" },
      { id: "CHEFS_TABLE", label: "Chef's Table" },
      { id: "WINE_TASTING", label: "Wine Tasting" },
      { id: "MASTERCLASS", label: "Masterclass" },
      { id: "FARM_TO_TABLE", label: "Farm to Table" },
    ],
  },
  {
    label: "Theme",
    name: "theme",
    componentType: "input",
    type: "text",
    placeholder: "Enter club theme (optional)",
  },
  {
    label: "Host",
    name: "host_id",
    componentType: "select",
    options: [
      // Will be populated dynamically from chefs
    ],
  },
  {
    label: "Menu Details",
    name: "menu_details",
    componentType: "textarea",
    placeholder: "Describe the menu and culinary experience",
  },
  {
    label: "Dietary Notes",
    name: "dietary_notes",
    componentType: "textarea",
    placeholder: "Dietary accommodations and restrictions",
  },
  {
    label: "Cancellation Policy",
    name: "cancellation_policy",
    componentType: "textarea",
    placeholder: "Enter cancellation policy",
  },
  {
    label: "Members Only",
    name: "is_members_only",
    componentType: "select",
    options: [
      { id: "true", label: "Yes" },
      { id: "false", label: "No" },
    ],
  },
  {
    label: "Status",
    name: "status",
    componentType: "select",
    options: [
      { id: "DRAFT", label: "Draft" },
      { id: "LIVE", label: "Live" },
      { id: "FULLY_BOOKED", label: "Fully Booked" },
      { id: "COMPLETED", label: "Completed" },
    ],
  },
  {
    label: "Default Duration",
    name: "default_duration",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 2-3 hours",
  },
  {
    label: "Default Group Size",
    name: "default_group_size",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 2-8 guests",
  },
  {
    label: "Default Location Description",
    name: "default_location_description",
    componentType: "textarea",
    placeholder: "e.g., Private residence - details provided after booking",
  },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

export const addRecipeFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter recipe title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter brief description of the recipe",
  },
  {
    label: "Type",
    name: "type",
    componentType: "select",
    options: [
      { id: "recipe", label: "Recipe" },
      { id: "blog", label: "Blog" },
    ],
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "Veg", label: "Veg" },
      { id: "Non-Veg", label: "Non-Veg" },
      { id: "Dessert", label: "Dessert" },
      { id: "Beverage", label: "Beverage" },
      { id: "Appetizer", label: "Appetizer" },
      { id: "Main Course", label: "Main Course" },
      { id: "Other", label: "Other" },
    ],
  },
  {
    label: "Custom Category",
    name: "customCategory",
    componentType: "input",
    type: "text",
    placeholder: "Enter custom category name",
    showIf: (formData) => formData.category === "Other",
  },
  {
    label: "Total Time",
    name: "totalTime",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 45 mins",
  },
  {
    label: "Servings",
    name: "servings",
    componentType: "input",
    type: "number",
    placeholder: "Number of servings",
  },
  {
    label: "Difficulty",
    name: "difficulty",
    componentType: "select",
    options: [
      { id: "Easy", label: "Easy" },
      { id: "Medium", label: "Medium" },
      { id: "Hard", label: "Hard" },
    ],
  },
  {
    label: "Ingredients (comma separated)",
    name: "ingredients",
    componentType: "textarea",
    placeholder: "Enter ingredients separated by commas",
  },
  {
    label: "Instructions",
    name: "instructions",
    componentType: "rich-text",
    placeholder: "Enter cooking instructions with rich formatting...",
  },
  {
    label: "Author",
    name: "author",
    componentType: "input",
    type: "text",
    placeholder: "Author name",
  },
  {
    label: "Published",
    name: "isPublished",
    componentType: "select",
    options: [
      { id: "true", label: "Published" },
      { id: "false", label: "Draft" },
    ],
  },
];

export const addChefFormElements = [
  {
    label: "Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter chef name",
  },
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter chef title (e.g., Executive Chef)",
  },
  {
    label: "Bio",
    name: "bio",
    componentType: "textarea",
    placeholder: "Enter chef biography",
  },
  {
    label: "Experience",
    name: "experience",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 15+ years in culinary industry",
  },
  {
    label: "Best Advice",
    name: "bestAdvice",
    componentType: "textarea",
    placeholder: "Enter best advice received by the chef",
  },
  {
    label: "Memberships (comma separated)",
    name: "memberships",
    componentType: "textarea",
    placeholder: "Enter professional memberships separated by commas",
  },
  {
    label: "Recognition (comma separated)",
    name: "recognition",
    componentType: "textarea",
    placeholder: "Enter awards and recognition separated by commas",
  },
  {
    label: "Specializations (comma separated)",
    name: "specializations",
    componentType: "textarea",
    placeholder: "Enter culinary specializations separated by commas",
  },
  {
    label: "Email",
    name: "email",
    componentType: "input",
    type: "email",
    placeholder: "Enter chef email (optional)",
  },
  {
    label: "LinkedIn URL",
    name: "linkedin",
    componentType: "input",
    type: "url",
    placeholder: "Enter LinkedIn profile URL (optional)",
  },
  {
    label: "Twitter URL",
    name: "twitter",
    componentType: "input",
    type: "url",
    placeholder: "Enter Twitter profile URL (optional)",
  },
  {
    label: "Instagram URL",
    name: "instagram",
    componentType: "input",
    type: "url",
    placeholder: "Enter Instagram profile URL (optional)",
  },
  {
    label: "Active Status",
    name: "isActive",
    componentType: "select",
    options: [
      { id: "true", label: "Active" },
      { id: "false", label: "Inactive" },
    ],
  },
  {
    label: "Display Order",
    name: "order",
    componentType: "input",
    type: "number",
    placeholder: "Enter display order (lower numbers appear first)",
  },
];

export const addBlogFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter blog title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter brief description of blog",
  },
  {
    label: "Type",
    name: "type",
    componentType: "select",
    options: [
      { id: "recipe", label: "Recipe" },
      { id: "blog", label: "Blog" },
    ],
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "Cooking Tips", label: "Cooking Tips" },
      { id: "Food Stories", label: "Food Stories" },
      { id: "Restaurant Reviews", label: "Restaurant Reviews" },
      { id: "Culinary Travel", label: "Culinary Travel" },
      { id: "Chef Interviews", label: "Chef Interviews" },
      { id: "Food Trends", label: "Food Trends" },
      { id: "Other", label: "Other" },
    ],
  },
  {
    label: "Custom Category",
    name: "customCategory",
    componentType: "input",
    type: "text",
    placeholder: "Enter custom category name",
    showIf: (formData) => formData.category === "Other",
  },
  {
    label: "Content",
    name: "content",
    componentType: "rich-text",
    placeholder: "Write your blog content here...",
  },
  {
    label: "Tags (comma separated)",
    name: "tags",
    componentType: "input",
    type: "text",
    placeholder: "Enter tags separated by commas",
  },
  {
    label: "Author",
    name: "author",
    componentType: "input",
    type: "text",
    placeholder: "Author name",
  },
  {
    label: "Published",
    name: "isPublished",
    componentType: "select",
    options: [
      { id: "true", label: "Published" },
      { id: "false", label: "Draft" },
    ],
  },
];

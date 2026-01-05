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
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
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

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
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

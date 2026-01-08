const mongoose = require("mongoose");
const Chef = require("../models/Chef");

// Sample host data
const sampleHosts = [
  {
    name: "Chef Marco Rossi",
    title: "Executive Chef & Owner",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&crop=face",
    experience: "15+ years in Italian cuisine",
    bio: "Chef Marco brings authentic Italian flavors from his grandmother's recipes. Trained in Milan and worked in Michelin-starred restaurants across Europe.",
    bestAdvice: "Cook with passion and always use fresh, local ingredients.",
    memberships: ["Italian Chef Association", "World Culinary Federation"],
    recognition: ["Michelin Star 2019", "Best Italian Chef 2021"],
    specializations: ["Italian Cuisine", "Pasta Making", "Wine Pairing"],
    email: "marco@restaurant.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/marcorossi",
      instagram: "https://instagram.com/chefmarcorossi",
      twitter: "https://twitter.com/chefmarcorossi"
    },
    isActive: true,
    order: 1
  },
  {
    name: "Chef Sarah Chen",
    title: "Pastry Chef & Chocolatier",
    image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&h=400&fit=crop&crop=face",
    experience: "10+ years in French patisserie",
    bio: "Sarah combines traditional French techniques with modern creativity. She studied at Le Cordon Bleu and worked in Paris' finest patisseries.",
    bestAdvice: "Precision is key in pastry. Every gram counts.",
    memberships: ["French Pastry Society", "Chocolate Makers Guild"],
    recognition: ["Best Pastry Chef 2022", "Chocolate Master Award"],
    specializations: ["French Pastries", "Chocolate Art", "Dessert Plating"],
    email: "sarah@pastry.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahchen",
      instagram: "https://instagram.com/chefsarahchen"
    },
    isActive: true,
    order: 2
  },
  {
    name: "Chef James Mitchell",
    title: "Farm-to-Table Pioneer",
    image: "https://images.unsplash.com/photo-1568605110079-2d6a2a35c5c2?w=400&h=400&fit=crop&crop=face",
    experience: "12+ years in sustainable cooking",
    bio: "James is passionate about sustainable cooking and works directly with local farms. He believes in knowing the origin of every ingredient.",
    bestAdvice: "Know your farmer, know your food.",
    memberships: ["Sustainable Chef Association", "Farm-to-Table Alliance"],
    recognition: ["Sustainability Award 2023", "Local Hero Award"],
    specializations: ["Farm-to-Table", "Seasonal Cooking", "Sustainable Cuisine"],
    email: "james@farmtable.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/jamesmitchell",
      instagram: "https://instagram.com/chefjamesmitchell"
    },
    isActive: true,
    order: 3
  },
  {
    name: "Chef Elena Rodriguez",
    title: "Spanish Cuisine Expert",
    image: "https://images.unsplash.com/photo-1544717297-fa95be6e1fc6?w=400&h=400&fit=crop&crop=face",
    experience: "8+ years in Spanish gastronomy",
    bio: "Elena specializes in traditional Spanish tapas and modern Spanish cuisine. She trained in Barcelona and brings authentic flavors to every dish.",
    bestAdvice: "Spanish food is about sharing - make every dish memorable.",
    memberships: ["Spanish Culinary Association", "Tapas Masters Guild"],
    recognition: ["Rising Star Chef 2021", "Best Tapas Menu 2022"],
    specializations: ["Spanish Tapas", "Paella", "Sangria & Cocktails"],
    email: "elena@spanishkitchen.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/elenarodriguez",
      instagram: "https://instagram.com/chefelenarodriguez"
    },
    isActive: true,
    order: 4
  },
  {
    name: "Chef David Kim",
    title: "Asian Fusion Specialist",
    image: "https://images.unsplash.com/photo-1566554273589-f28e9b209e64?w=400&h=400&fit=crop&crop=face",
    experience: "10+ years in Asian fusion cuisine",
    bio: "David blends traditional Asian techniques with modern culinary innovation. He trained in Tokyo and worked in fusion restaurants across Asia.",
    bestAdvice: "Respect tradition but don't be afraid to innovate.",
    memberships: ["Asian Chef Federation", "Fusion Cuisine Society"],
    recognition: ["Innovation Award 2022", "Best Fusion Restaurant 2023"],
    specializations: ["Asian Fusion", "Sushi & Sashimi", "Korean BBQ"],
    email: "david@fusionkitchen.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/davidkim",
      instagram: "https://instagram.com/chefdavidkim"
    },
    isActive: true,
    order: 5
  }
];

async function seedHosts() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://SethiNagendra:SethiNagendra@cluster0.navdqbm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    
    console.log("Connected to MongoDB");
    
    // Clear existing hosts (optional - remove if you want to keep existing)
    // await Chef.deleteMany({});
    
    // Insert sample hosts
    const insertedHosts = await Chef.insertMany(sampleHosts);
    
    console.log(`Successfully inserted ${insertedHosts.length} sample hosts:`);
    insertedHosts.forEach((host, index) => {
      console.log(`${index + 1}. ${host.name} - ${host.title}`);
    });
    
    console.log("\nSample hosts are now available for selection in the gourmet club form!");
    
  } catch (error) {
    console.error("Error seeding hosts:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seed function
seedHosts();

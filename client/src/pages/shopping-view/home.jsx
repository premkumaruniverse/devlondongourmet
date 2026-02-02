import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getFeatureImages } from "@/store/common-slice";
import { ChefHat, Leaf, Star, Utensils, Wine } from "lucide-react";

// Product Categories with Subcategories
const productCategories = [
  {
    id: "rubs-spice-mix",
    name: "Rubs & Spice Mix",
    description: "Signature spice blends",
    subcategories: ["Spice Mix", "Kebab Rubs"],
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: "achar",
    name: "Achar",
    description: "Artisan pickles",
    subcategories: [],
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: "rassa",
    name: "Rassa",
    description: "Gourmet gravies & chutneys",
    subcategories: ["Gravies", "Chutneys"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
  },
  {
    id: "cured-coated",
    name: "Cured & Coated",
    description: "Premium marinated selections",
    subcategories: ["Meats", "Chicken", "Sea Food"],
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  }
];

const experienceBrands = [
  {
    id: "diners-atlas",
    name: "Diner's Atlas",
    description: "Luxury catering & fine dining experiences",
    icon: <Utensils className="w-8 h-8 mb-4" />,
    cta: "Book a Dining Experience",
    link: "/shop/diners-atlas"
  },
  {
    id: "gourmet-club",
    name: "Gourmet Club",
    description: "Members-only culinary experiences",
    icon: <Wine className="w-8 h-8 mb-4" />,
    cta: "Join the Club",
    link: "/shop/gourmet-club"
  },
  {
    id: "ayu-bite",
    name: "Ayu Bite",
    description: "Healthy & mindful eating",
    icon: <Leaf className="w-8 h-8 mb-4" />,
    cta: "Explore Healthy Choices",
    link: "/shop/ayu-bite"
  }
];


const testimonials = [
  {
    id: 1,
    quote: "The spices transformed my home cooking to restaurant quality. Absolutely divine!",
    author: "Sarah M.",
    role: "Food Enthusiast"
  },
  {
    id: 2,
    quote: "Our wedding catering was handled by Diner's Atlas and it was the highlight of our special day.",
    author: "James & Priya",
    role: "Happy Couple"
  },
  {
    id: 3,
    quote: "The Gourmet Club membership has been worth every penny. The wine pairing dinners are exceptional.",
    author: "Michael T.",
    role: "Gourmet Club Member"
  }
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (featureImageList.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featureImageList]);

  const navigateTo = (path) => {
    navigate(path);
  };
  const [cardTransforms, setCardTransforms] = useState({});
  const [brandTransforms, setBrandTransforms] = useState({});
  const [testimonialTransforms, setTestimonialTransforms] = useState({});
  const handleCardMove = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 20;
    const rotateX = (0.5 - y) * 20;
    const dx = (x - 0.5) * 20;
    const dy = (0.5 - y) * 16;
    const lightBg = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.14), transparent 45%)`;
    setCardTransforms((prev) => ({
      ...prev,
      [idx]: {
        container: {
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`,
          boxShadow: `0 18px 34px rgba(0,0,0,0.22)`,
          transition: `transform 60ms linear, box-shadow 200ms ease`,
          willChange: `transform`,
        },
        img: {
          transform: `translate3d(${dx}px, ${dy}px, 0) scale(1.12)`,
          transition: `transform 60ms linear`,
          willChange: `transform`,
        },
        content: {
          transform: `translateZ(14px) translate3d(${dx * 0.35}px, ${dy * 0.35}px, 0)`,
          transition: `transform 60ms linear`,
          willChange: `transform`,
        },
        light: {
          background: lightBg,
          opacity: 1,
          transition: `background 80ms linear, opacity 200ms ease`,
        },
      },
    }));
  };
  const handleCardLeave = (idx) => {
    setCardTransforms((prev) => ({
      ...prev,
      [idx]: {
        container: { transform: ``, boxShadow: `` },
        img: { transform: `` },
        content: { transform: `` },
        light: { opacity: 0 },
      },
    }));
  };
  const handleBrandMove = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 18;
    const rotateX = (0.5 - y) * 18;
    const dx = (x - 0.5) * 14;
    const dy = (0.5 - y) * 12;
    const lightBg = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.12), transparent 45%)`;
    setBrandTransforms((prev) => ({
      ...prev,
      [idx]: {
        container: {
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
          boxShadow: `0 16px 30px rgba(0,0,0,0.18)`,
          transition: `transform 60ms linear, box-shadow 200ms ease`,
        },
        content: {
          transform: `translateZ(12px) translate3d(${dx * 0.3}px, ${dy * 0.3}px, 0)`,
          transition: `transform 60ms linear`,
        },
        light: {
          background: lightBg,
          opacity: 1,
          transition: `background 80ms linear, opacity 200ms ease`,
        },
      },
    }));
  };
  const handleBrandLeave = (idx) => {
    setBrandTransforms((prev) => ({
      ...prev,
      [idx]: {
        container: { transform: ``, boxShadow: `` },
        content: { transform: `` },
        light: { opacity: 0 },
      },
    }));
  };
  const handleTestimonialMove = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 16;
    const rotateX = (0.5 - y) * 16;
    const dx = (x - 0.5) * 12;
    const dy = (0.5 - y) * 10;
    const lightBg = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.1), transparent 45%)`;
    setTestimonialTransforms((prev) => ({
      ...prev,
      [idx]: {
        container: {
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`,
          boxShadow: `0 14px 26px rgba(0,0,0,0.16)`,
          transition: `transform 60ms linear, box-shadow 200ms ease`,
        },
        content: {
          transform: `translateZ(10px) translate3d(${dx * 0.25}px, ${dy * 0.25}px, 0)`,
          transition: `transform 60ms linear`,
        },
        light: {
          background: lightBg,
          opacity: 1,
          transition: `background 80ms linear, opacity 200ms ease`,
        },
      },
    }));
  };
  const handleTestimonialLeave = (idx) => {
    setTestimonialTransforms((prev) => ({
      ...prev,
      [idx]: {
        container: { transform: ``, boxShadow: `` },
        content: { transform: `` },
        light: { opacity: 0 },
      },
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden perspective-1000">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          {featureImageList && featureImageList.length > 0 ? (
            <div className="relative w-full h-full">
              {featureImageList.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700" />
          )}
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-[320px] h-[320px] md:w-[520px] md:h-[520px] hover-tilt-strong hover-glow-3d transform-gpu">
            <model-viewer
              src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
              alt="Interactive 3D model"
              auto-rotate
              camera-controls
              shadow-intensity="1"
              className="w-full h-full"
            ></model-viewer>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Gourmet Collections
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium culinary offerings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
            {productCategories.map((category, index) => (
              <Card 
                key={category.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer transform-gpu hover-tilt-strong hover-glow-3d"
                style={cardTransforms[index]?.container}
                onMouseMove={(e) => handleCardMove(index, e)}
                onMouseLeave={() => handleCardLeave(index)}
                onClick={() => navigateTo(`/shop/listing?category=${category.id}`)}
              >
                <CardContent className="p-0 z-pop" style={cardTransforms[index]?.content}>
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={cardTransforms[index]?.img}
                    />
                    <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={cardTransforms[index]?.light}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 z-pop">
                      <div className="z-pop">
                        <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                        <p className="text-gray-200">{category.description}</p>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {category.subcategories.map((sub, idx) => (
                              <span key={idx} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                {sub}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Brands Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
              More Than Food – It&rsquo;s an Experience
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our exclusive culinary experiences and services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {experienceBrands.map((brand, index) => (
              <Card 
                key={brand.id} 
                className="p-8 text-center hover:shadow-2xl transition-shadow transform-gpu hover-tilt-strong hover-glow-3d dark:bg-gray-800 dark:border-gray-700"
                style={brandTransforms[index]?.container}
                onMouseMove={(e) => handleBrandMove(index, e)}
                onMouseLeave={() => handleBrandLeave(index)}
              >
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={brandTransforms[index]?.light}></div>
                <div className="text-amber-600 flex justify-center" style={brandTransforms[index]?.content}>
                  {brand.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-gray-100" style={brandTransforms[index]?.content}>{brand.name}</h3>
                <p className="text-gray-600 dark:text-gray-300" style={brandTransforms[index]?.content}>{brand.description}</p>
                <Button 
                  variant="outline" 
                  className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700 transform hover:scale-105"
                  onClick={() => navigateTo(brand.link)}
                >
                  {brand.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6">
                About London Gourmet
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
                London Gourmet is a premium culinary brand dedicated to creating unforgettable food experiences. 
                From handcrafted gourmet products to bespoke dining events, we blend traditional techniques 
                with modern gastronomy.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <ChefHat className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Chef-Driven Creativity</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expertly crafted by our master chefs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Leaf className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Farm-to-Fork</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Premium, locally-sourced ingredients</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
                onClick={() => navigateTo('/about')}
              >
                Read Our Story
              </Button>
            </div>
            
            <div className="md:w-1/2 h-96 md:h-[500px] rounded-lg overflow-hidden shadow-xl transform-gpu hover-tilt-strong hover-glow-3d perspective-1000">
              <img 
                src="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Chef preparing food"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-amber-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don&rsquo;t just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id} 
                className="p-8 text-center hover:shadow-2xl transition-shadow h-full flex flex-col transform-gpu hover-tilt-strong hover-glow-3d dark:bg-gray-800 dark:border-gray-700"
                style={testimonialTransforms[index]?.container}
                onMouseMove={(e) => handleTestimonialMove(index, e)}
                onMouseLeave={() => handleTestimonialLeave(index)}
              >
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={testimonialTransforms[index]?.light}></div>
                <div className="text-amber-400 mb-4 flex justify-center" style={testimonialTransforms[index]?.content}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 italic mb-6 flex-grow" style={testimonialTransforms[index]?.content}>
                  {testimonial.quote}
                </blockquote>
                <div>
                  <p className="font-semibold dark:text-gray-100" style={testimonialTransforms[index]?.content}>{testimonial.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400" style={testimonialTransforms[index]?.content}>{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Let&rsquo;s Create Something Delicious Together
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Whether you&rsquo;re looking for premium ingredients, catering for your next event, 
            or an exclusive dining experience, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg"
              onClick={() => navigateTo('/contact')}
            >
              Contact Us
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={() => navigateTo('/shop/diners-atlas#book')}
            >
              Book an Event
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

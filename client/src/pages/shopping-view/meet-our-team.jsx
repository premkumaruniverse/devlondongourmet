import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllChefs } from "@/store/shop/chefs-slice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function MeetOurTeam() {
  const dispatch = useDispatch();
  const { chefList, isLoading } = useSelector((state) => state.shopChefs);

  useEffect(() => {
    dispatch(fetchAllChefs());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:bg-background dark:from-background dark:to-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-80 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:bg-background dark:from-background dark:to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-primary mb-6">
            Meet Our Chefs
          </h1>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-orange-600 dark:text-primary mb-4">
              FROM PLAN TO PLATE
            </h2>
            <p className="text-lg text-gray-700 dark:text-muted-foreground leading-relaxed">
              Our secret weapon is our passion for food, embodied in each of our culinary experts 
              and executed by our world-class chefs. Though trends change and diets evolve, you can 
              always count on our culinary team to cook up something fresh.
            </p>
          </div>
        </div>

        {/* Team Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-primary mb-6">
            MEET OUR CULINARY TEAM
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 dark:text-muted-foreground leading-relaxed mb-6">
              Our team of renowned chefs is passionate about creating exceptional, authentic flavor 
              in every system and product. With a combined 50+ years of experience from front-of-the-house 
              to back-of-the-house, our chefs know what it takes to develop innovative, delicious products 
              that satisfy consumers' taste buds and expand your bottom line.
            </p>
            <p className="text-md text-orange-600 dark:text-primary font-semibold">
              LEARN MORE ABOUT WHAT IGNITES EACH OF OUR CHEFS CULINARY SPIRIT BY CLICKING ON THEIR PROFILES BELOW.
            </p>
          </div>
        </div>

        {/* Chefs Grid */}
        {chefList && chefList.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {chefList.map((chef) => (
              <Card key={chef._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-card dark:border-border">
                <div className="relative overflow-hidden">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">
                    {chef.name.toUpperCase()}
                  </h3>
                  <p className="text-lg font-semibold text-orange-600 dark:text-primary mb-4">
                    {chef.title}
                  </p>
                  
                  {chef.specializations && chef.specializations.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {chef.specializations.slice(0, 3).map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-primary/20 dark:text-primary text-sm rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                        {chef.specializations.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-muted dark:text-muted-foreground text-sm rounded-full">
                            +{chef.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600 dark:text-muted-foreground mb-6 line-clamp-3">
                    {chef.bio}
                  </p>

                  <Link to={`/shop/chefs/${chef._id}`}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground text-white font-semibold">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-muted-foreground">
              Our culinary team is being prepared. Check back soon to meet our amazing chefs!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetOurTeam;

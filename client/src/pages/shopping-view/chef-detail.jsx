import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchChefDetails } from "@/store/shop/chefs-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Linkedin, 
  Twitter, 
  Instagram, 
  ArrowLeft,
  Award,
  Users,
  BookOpen,
  Lightbulb
} from "lucide-react";

function ChefDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { chefDetails, isLoading } = useSelector((state) => state.shopChefs);

  useEffect(() => {
    if (id) {
      dispatch(fetchChefDetails(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:bg-background dark:from-background dark:to-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-8 w-96" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chefDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:bg-background dark:from-background dark:to-background py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-primary mb-4">Chef Not Found</h1>
          <p className="text-lg text-gray-600 dark:text-muted-foreground mb-8">
            The chef you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop/meet-our-team">
            <Button className="bg-orange-600 hover:bg-orange-700 dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground">
              Back to Meet Our Team
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:bg-background dark:from-background dark:to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/shop/meet-our-team">
            <Button variant="outline" className="flex items-center gap-2 dark:text-primary dark:border-primary dark:hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4" />
              Back to Meet Our Team
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chef Image and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden sticky top-4 dark:bg-card dark:border-border">
              <div className="relative">
                <img
                  src={chefDetails.image}
                  alt={chefDetails.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm dark:bg-card/90 rounded-lg p-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-primary mb-1">
                      {chefDetails.name}
                    </h1>
                    <p className="text-lg font-semibold text-orange-600 dark:text-primary/90">
                      {chefDetails.title}
                    </p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Social Links */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {chefDetails.email && (
                    <a
                      href={`mailto:${chefDetails.email}`}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-muted dark:hover:bg-muted/80 dark:text-foreground rounded-lg transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email</span>
                    </a>
                  )}
                  {chefDetails.socialLinks?.linkedin && (
                    <a
                      href={chefDetails.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 dark:text-blue-200 rounded-lg transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                  {chefDetails.socialLinks?.twitter && (
                    <a
                      href={chefDetails.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-sky-900/50 dark:hover:bg-sky-900/70 dark:text-sky-200 rounded-lg transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  {chefDetails.socialLinks?.instagram && (
                    <a
                      href={chefDetails.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-900/50 dark:hover:bg-pink-900/70 dark:text-pink-200 rounded-lg transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}
                </div>

                {/* Experience */}
                {chefDetails.experience && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-primary mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-orange-600 dark:text-primary" />
                      Experience
                    </h3>
                    <p className="text-gray-700 dark:text-muted-foreground">{chefDetails.experience}</p>
                  </div>
                )}

                {/* Specializations */}
                {chefDetails.specializations && chefDetails.specializations.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-primary mb-3">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {chefDetails.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-primary/20 dark:text-primary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <Card className="dark:bg-card dark:border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-primary mb-4">Biography</h2>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {chefDetails.bio}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Best Advice */}
            {chefDetails.bestAdvice && (
              <Card className="dark:bg-card dark:border-border">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-primary mb-4 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-orange-600 dark:text-primary" />
                    Best Advice
                  </h2>
                  <blockquote className="text-lg text-gray-700 dark:text-muted-foreground italic border-l-4 border-orange-400 dark:border-primary pl-6">
                    "{chefDetails.bestAdvice}"
                  </blockquote>
                </CardContent>
              </Card>
            )}

            {/* Memberships */}
            {chefDetails.memberships && chefDetails.memberships.length > 0 && (
              <Card className="dark:bg-card dark:border-border">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-primary mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-orange-600 dark:text-primary" />
                    Professional Memberships
                  </h2>
                  <ul className="space-y-2">
                    {chefDetails.memberships.map((membership, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 dark:bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-muted-foreground">{membership}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recognition */}
            {chefDetails.recognition && chefDetails.recognition.length > 0 && (
              <Card className="dark:bg-card dark:border-border">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-primary mb-4 flex items-center gap-2">
                    <Award className="h-6 w-6 text-orange-600 dark:text-primary" />
                    Recognition & Awards
                  </h2>
                  <ul className="space-y-2">
                    {chefDetails.recognition.map((recognition, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 dark:bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-muted-foreground">{recognition}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChefDetail;

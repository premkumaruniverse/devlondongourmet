import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

function AdminRecipeTile({ recipe, setFormData, setOpenCreateRecipesDialog, setCurrentEditedId, handleDelete, setUploadedImageUrl }) {
  const getTypeLabel = (type) => {
    return type === 'recipe' ? 'Recipe' : 'Blog';
  };

  const getTypeColor = (type) => {
    return type === 'recipe' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getStatusColor = (isPublished) => {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
          <div className="flex gap-1">
            <Badge className={getTypeColor(recipe.type)}>
              {getTypeLabel(recipe.type)}
            </Badge>
            <Badge className={getStatusColor(recipe.isPublished)}>
              {recipe.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{recipe.category}</Badge>
            <Badge variant="outline">{recipe.difficulty}</Badge>
            <Badge variant="outline">{recipe.prepTime}</Badge>
          </div>
          <p className="text-xs text-gray-500">By {recipe.author}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setFormData({
                title: recipe.title,
                description: recipe.description,
                type: recipe.type,
                category: recipe.category,
                customCategory: "",
                totalTime: recipe.totalTime || "",
                prepTime: recipe.prepTime || "",
                cookTime: recipe.cookTime || "",
                servings: recipe.servings?.toString() || "",
                difficulty: recipe.difficulty || "",
                ingredients: recipe.ingredients ? recipe.ingredients.join(', ') : "",
                instructions: recipe.instructions ? recipe.instructions.join('\n') : "",
                content: recipe.content || "",
                tags: recipe.tags ? recipe.tags.join(', ') : "",
                author: recipe.author,
                isPublished: recipe.isPublished.toString(),
              });
              setUploadedImageUrl(recipe.image || "");
              setCurrentEditedId(recipe._id);
              setOpenCreateRecipesDialog(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => handleDelete(recipe._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AdminRecipeTile;

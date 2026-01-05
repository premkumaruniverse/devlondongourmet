import AdminRecipeTile from "@/components/admin-view/recipe-tile";
import CommonForm from "@/components/common/form";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addRecipeFormElements, addBlogFormElements } from "@/config";
import {
  addNewRecipe,
  deleteRecipe,
  editRecipe,
  fetchAllRecipes,
} from "@/store/admin/recipes-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  title: "",
  description: "",
  type: "recipe",
  category: "",
  customCategory: "",
  totalTime: "",
  prepTime: "",
  cookTime: "",
  servings: "",
  difficulty: "",
  ingredients: "",
  instructions: "",
  content: "",
  tags: "",
  author: "",
  isPublished: "true",
};

function AdminRecipes() {
  const [openCreateRecipesDialog, setOpenCreateRecipesDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { recipeList } = useSelector((state) => state.adminRecipes);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    // Process form data based on type
    const processedFormData = {
      ...formData,
      image: uploadedImageUrl || "https://via.placeholder.com/300x200?text=Recipe",
      isPublished: formData.isPublished === "true",
    };

    // Handle custom category
    if (formData.category === "Other" && formData.customCategory) {
      processedFormData.category = formData.customCategory;
    }

    // Handle recipe-specific fields
    if (formData.type === 'recipe') {
      processedFormData.ingredients = formData.ingredients ? formData.ingredients.split(',').map(item => item.trim()).filter(item => item) : [];
      // Instructions are now rich text, so don't split by lines
      processedFormData.instructions = formData.instructions ? [formData.instructions] : [];
      processedFormData.servings = parseInt(formData.servings) || 1;
    }

    // Handle blog-specific fields
    if (formData.type === 'blog') {
      processedFormData.tags = formData.tags ? formData.tags.split(',').map(item => item.trim()).filter(item => item) : [];
      // Clear recipe-specific fields for blogs
      processedFormData.ingredients = [];
      processedFormData.instructions = [];
      processedFormData.totalTime = "";
      processedFormData.prepTime = "";
      processedFormData.cookTime = "";
      processedFormData.servings = 1;
      processedFormData.difficulty = "";
    }

    currentEditedId !== null
      ? dispatch(
          editRecipe({
            id: currentEditedId,
            formData: processedFormData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllRecipes());
            setFormData(initialFormData);
            setImageFile(null);
            setUploadedImageUrl("");
            setOpenCreateRecipesDialog(false);
            setCurrentEditedId(null);
            toast({
              title: "Recipe updated successfully",
            });
          }
        })
      : dispatch(
          addNewRecipe(processedFormData)
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllRecipes());
            setOpenCreateRecipesDialog(false);
            setImageFile(null);
            setUploadedImageUrl("");
            setFormData(initialFormData);
            toast({
              title: "Recipe added successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentRecipeId) {
    dispatch(deleteRecipe(getCurrentRecipeId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllRecipes());
        toast({
          title: "Recipe deleted successfully",
        });
      }
    });
  }

  function isFormValid() {
    const requiredFields = formData.type === 'recipe' 
      ? ['title', 'description', 'category', 'totalTime', 'difficulty', 'ingredients', 'instructions', 'author']
      : ['title', 'description', 'category', 'content', 'author'];
    return requiredFields.every((key) => formData[key] !== "");
  }

  function getCurrentFormElements() {
    return formData.type === 'recipe' ? addRecipeFormElements : addBlogFormElements;
  }

  useEffect(() => {
    dispatch(fetchAllRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateRecipesDialog(true)}>
          Add New Recipe/Blog
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {recipeList && recipeList.length > 0
          ? recipeList.map((recipeItem) => (
              <AdminRecipeTile
                setFormData={setFormData}
                setOpenCreateRecipesDialog={setOpenCreateRecipesDialog}
                setCurrentEditedId={setCurrentEditedId}
                recipe={recipeItem}
                handleDelete={handleDelete}
                setUploadedImageUrl={setUploadedImageUrl}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateRecipesDialog}
        onOpenChange={() => {
          setOpenCreateRecipesDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl("");
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Recipe/Blog" : "Add New Recipe/Blog"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
            currentImage={currentEditedId ? recipeList.find(r => r._id === currentEditedId)?.image : null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={getCurrentFormElements()}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminRecipes;

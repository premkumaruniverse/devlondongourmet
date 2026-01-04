import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { subcategoryOptionsMap } from "@/config";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [filteredFormControls, setFilteredFormControls] = useState([...formControls]);

  // Update dependent fields when form data changes
  useEffect(() => {
    const updatedControls = formControls.map(control => {
      // If this control has a dependency, check if it should be shown
      if (control.dependentOn) {
        const parentValue = formData[control.dependentOn];
        
        // If this is a subcategory dropdown, update its options based on the selected category
        if (control.name === 'subcategory' && parentValue) {
          const subcategories = subcategoryOptionsMap[parentValue] || [];
          return {
            ...control,
            options: subcategories.map(sub => ({
              id: sub.toLowerCase().replace(/\s+/g, '-'),
              label: sub
            }))
          };
        }
        
        // If parent value is not selected, hide the dependent field
        if (!parentValue) {
          return { ...control, hidden: true };
        }
        
        return { ...control, hidden: false };
      }
      return control;
    });
    
    setFilteredFormControls(updatedControls);
  }, [formData, formControls]);
  
  // When a category is selected, clear the subcategory
  const handleCategoryChange = (value, control) => {
    // If this is the category field, clear the subcategory
    if (control.name === 'category') {
      setFormData({
        ...formData,
        [control.name]: value,
        subcategory: '' // Clear subcategory when category changes
      });
    } else {
      setFormData({
        ...formData,
        [control.name]: value
      });
    }
  };
  function renderInputsByComponentType(getControlItem) {
    // Skip rendering if the control is hidden
    if (getControlItem.hidden) return null;
    
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
        
      case "select":
        element = (
          <Select
            onValueChange={(value) => handleCategoryChange(value, getControlItem)}
            value={value}
            disabled={getControlItem.disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={
                  getControlItem.options?.length > 0 
                    ? `Select ${getControlItem.label.toLowerCase()}` 
                    : `No options available`
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0 ? (
                getControlItem.options.map((optionItem) => (
                  <SelectItem 
                    key={optionItem.id} 
                    value={optionItem.id}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {optionItem.label}
                  </SelectItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options available
                </div>
              )}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {filteredFormControls.map((controlItem) => (
        <div 
          key={controlItem.name} 
          className={`space-y-2 ${controlItem.hidden ? 'hidden' : ''}`}
        >
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          {renderInputsByComponentType(controlItem)}
        </div>
      ))}
      <Button type="submit" className="w-full mt-6" disabled={isBtnDisabled}>
        {buttonText}
      </Button>
    </form>
  );
}

export default CommonForm;

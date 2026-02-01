import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { API_URL } from "../../config/api";

function PdfUpload({
  pdfFile,
  setPdfFile,
  pdfLoadingState,
  uploadedPdfUrl,
  setUploadedPdfUrl,
  setPdfLoadingState,
  isEditMode,
}) {
  const inputRef = useRef(null);

  function handlePdfFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setPdfFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setPdfFile(droppedFile);
  }

  function handleRemovePdf() {
    setPdfFile(null);
    setUploadedPdfUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadPdfToCloudinary() {
    setPdfLoadingState(true);
    const data = new FormData();
    data.append("my_file", pdfFile);
    const response = await axios.post(
      `${API_URL}/api/admin/services/upload-image`,
      data
    );

    if (response?.data?.success) {
      const url =
        response.data.result.secure_url || response.data.result.url;
      setUploadedPdfUrl(url);
      setPdfLoadingState(false);
    }
  }

  useEffect(() => {
    if (pdfFile !== null) uploadPdfToCloudinary();
  }, [pdfFile]);

  return (
    <div className="w-full mt-4 max-w-md mx-auto">
      <Label className="text-lg font-semibold mb-2 block">Upload PDF</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4"
      >
        <Input
          id="pdf-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handlePdfFileChange}
          accept=".pdf"
        />
        {!pdfFile ? (
          <Label
            htmlFor="pdf-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload PDF</span>
          </Label>
        ) : pdfLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
            </div>
            <p className="text-sm font-medium">{pdfFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemovePdf}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove PDF</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfUpload;

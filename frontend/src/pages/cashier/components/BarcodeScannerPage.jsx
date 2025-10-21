import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function BarcodeScannerPage() {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // New ref for capturing the image
  const codeReaderRef = useRef(null);

  const resizeImage = (img, maxWidth = 600, maxHeight = 600) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    return canvas;
  };

  const startCameraScan = async () => {
    setScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      // Start decoding from the camera video stream
      await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err) => {
          if (result) {
            // Once barcode is detected, take a snapshot
            handleCapture();
            setBarcode(result.getText());
            setScanning(false);
            codeReader.reset();
          }
          if (err && err.name !== "NotFoundException") {
            console.error(err);
          }
        }
      );
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied. Please allow camera permission.");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      setScanning(false);
    }
  };

  // Capture the current frame from the video and resize it
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Draw the current video frame to the canvas
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

      // Resize image before scanning
      const img = new Image();
      img.src = canvasRef.current.toDataURL();

      img.onload = async () => {
        const resizedImg = resizeImage(img); // Resize the image
        const imgElement = new Image();
        imgElement.src = resizedImg.toDataURL(); // Set canvas as an image source

        imgElement.onload = async () => {
          const codeReader = new BrowserMultiFormatReader();
          try {
            const result = await codeReader.decodeFromImageElement(imgElement);
            if (result) {
              setBarcode(result.getText());
            } else {
              alert("No barcode detected. Try uploading a clearer image.");
            }
          } catch (err) {
            console.error("Failed to scan barcode from image:", err);
            alert("Failed to scan barcode from image. Please check the image quality.");
          }
        };

        imgElement.onerror = () => {
          console.error("Failed to load the resized image.");
          alert("Failed to load the resized image.");
        };
      };
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.onerror = () => alert("Failed to load image");
    reader.readAsDataURL(file);
  };

  const scanUploadedImage = async () => {
    if (!uploadedImage) return;

    const img = new Image();
    img.src = uploadedImage;

    img.onload = async () => {
      console.log("Image loaded with dimensions:", img.width, img.height); // Log image dimensions

      if (img.width < 100 || img.height < 100) {
        alert("The uploaded image is too small to scan. Please upload a higher resolution image.");
        return;
      }

      const resizedImg = resizeImage(img);  // Resize image before scanning

      // Ensure image is fully loaded and not corrupt
      if (resizedImg.width === 0 || resizedImg.height === 0) {
        alert("The image could not be processed. Please upload a valid image.");
        return;
      }

      // Convert canvas to img element to pass to ZXing
      const imgElement = new Image();
      imgElement.src = resizedImg.toDataURL();  // Set canvas as an image source

      imgElement.onload = async () => {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImageElement(imgElement);
          if (result) {
            setBarcode(result.getText());
          } else {
            alert("No barcode detected. Try uploading a clearer image.");
          }
        } catch (err) {
          console.error("Failed to scan barcode from image:", err);
          alert("Failed to scan barcode from image. Please check the image quality.");
        }
      };

      imgElement.onerror = () => {
        console.error("Failed to load the resized image.");
        alert("Failed to load the resized image.");
      };
    };

    img.onerror = () => {
      console.error("Failed to load the image.");
      alert("Failed to load the uploaded image.");
    };
  };

  const containerStyle = {
    textAlign: "center",
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f5f7fa",
    minHeight: "100vh",
  };

  const headingStyle = {
    color: "#0b5fff",
    marginBottom: "20px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "5px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease-in-out",
  };

  const startButtonStyle = {
    ...buttonStyle,
    background: scanning ? "#a0aec0" : "#0b5fff",
    color: "#fff",
  };

  const stopButtonStyle = {
    ...buttonStyle,
    background: "#ff4d4f",
    color: "#fff",
  };

  const scanButtonStyle = {
    ...buttonStyle,
    background: "#22c55e",
    color: "#fff",
  };

  const videoStyle = {
    width: "400px",
    height: "300px",
    border: "2px solid #0b5fff",
    borderRadius: "8px",
    marginTop: "10px",
  };

  const uploadedImgStyle = {
    maxWidth: "200px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  };

  const barcodeStyle = {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
  };

  const fileInputStyle = {
    marginTop: "10px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Barcode Scanner</h2>

      {/* Camera Scan */}
      <div>
        <button
          onClick={startCameraScan}
          disabled={scanning}
          style={startButtonStyle}
        >
          {scanning ? "Scanning..." : "Start Camera Scan"}
        </button>
        {scanning && (
          <button onClick={stopCamera} style={stopButtonStyle}>
            Stop Camera
          </button>
        )}
      </div>
      <video ref={videoRef} style={videoStyle} />

      {/* Upload Image Scan */}
      <div style={{ marginTop: "25px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={fileInputStyle}
        />
        {uploadedImage && (
          <div style={{ marginTop: "15px" }}>
            <img
              src={uploadedImage}
              alt="Uploaded"
              style={uploadedImgStyle}
            />
            <br />
            <button onClick={scanUploadedImage} style={scanButtonStyle}>
              Scan Uploaded Image
            </button>
          </div>
        )}
      </div>

      {/* Display Scanned Barcode */}
      {barcode && (
        <p style={barcodeStyle}>
          <strong>Scanned Barcode:</strong> {barcode}
        </p>
      )}

      {/* Hidden Canvas for capturing the image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

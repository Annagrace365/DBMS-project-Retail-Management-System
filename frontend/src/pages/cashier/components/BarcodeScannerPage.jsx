import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function BarcodeScannerPage({ onScan }) {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const codeReaderRef = useRef(null);

  // Resize image before scanning
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

  // Handle detected barcode
  const handleDetected = (scannedValue) => {
    setBarcode(scannedValue);
    if (onScan) onScan(scannedValue); // Call parent callback with the barcode value
  };

  // Start camera scan
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
            handleDetected(result.getText()); // Process the detected barcode
            setScanning(false); // Stop scanning once a barcode is detected
            codeReader.reset(); // Reset the reader
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

  // Stop camera scan
  const stopCamera = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      setScanning(false);
    }
  };

  // Handle capture of the video frame
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
    }
  };

  // Handle uploaded image scanning
  const scanUploadedImage = async () => {
    if (!uploadedImage) return;

    const img = new Image();
    img.src = uploadedImage;

    img.onload = async () => {
      // Resize and process the uploaded image
      const resizedImg = resizeImage(img);
      const imgElement = new Image();
      imgElement.src = resizedImg.toDataURL();

      imgElement.onload = async () => {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImageElement(imgElement);
          if (result) handleDetected(result.getText()); // Process the detected barcode
        } catch (err) {
          console.error("Failed to scan barcode from image:", err);
          alert("Failed to scan barcode from image. Please check the image quality.");
        }
      };
    };

    img.onerror = () => {
      console.error("Failed to load the uploaded image.");
      alert("Failed to load the uploaded image.");
    };
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.onerror = () => alert("Failed to load image");
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ textAlign: "center", padding: "0px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#f5f7fa", minHeight: "100vh" }}>
      <h2 style={{ color: "#0b5fff", marginBottom: "1px" }}>Barcode Scanner</h2>

      {/* Start/Stop Camera Scan */}
      <div>
        <button onClick={startCameraScan} disabled={scanning} style={{ padding: "10px 20px", margin: "5px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", background: scanning ? "#a0aec0" : "#0b5fff", color: "#fff" }}>
          {scanning ? "Scanning..." : "Start Camera Scan"}
        </button>
        {scanning && (
          <button onClick={stopCamera} style={{ padding: "10px 20px", margin: "5px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", background: "#ff4d4f", color: "#fff" }}>
            Stop Camera
          </button>
        )}
      </div>
      <video ref={videoRef} style={{ width: "300px", height: "150px", border: "2px solid #0b5fff", borderRadius: "8px", marginTop: "10px" }} />

      {/* Upload Image Scan */}
      <div style={{ marginTop: "25px" }}>
        <input type="file" accept="image/*" onChange={handleUpload} style={{ marginTop: "10px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }} />
        {uploadedImage && (
          <div style={{ marginTop: "15px" }}>
            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "200px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
            <br />
            <button onClick={scanUploadedImage} style={{ padding: "6px 10px", background: "#22c55e", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
              Scan Uploaded Image
            </button>
          </div>
        )}
      </div>

      {/* Display Scanned Barcode */}
      {barcode && (
        <p style={{ marginTop: "20px", fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
          <strong>Scanned Barcode:</strong> {barcode}
        </p>
      )}

      {/* Hidden Canvas for capturing the image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

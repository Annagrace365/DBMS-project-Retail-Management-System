import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function BarcodeScannerPage({ onScan }) {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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

  const handleDetected = (scannedValue) => {
    setBarcode(scannedValue);
    if (onScan) onScan(scannedValue); // Call parent callback
  };

  const startCameraScan = async () => {
    setScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err) => {
          if (result) {
            handleCapture();
            handleDetected(result.getText()); // Pass detected barcode
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

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

      const img = new Image();
      img.src = canvasRef.current.toDataURL();

      img.onload = async () => {
        const resizedImg = resizeImage(img);
        const imgElement = new Image();
        imgElement.src = resizedImg.toDataURL();
        imgElement.onload = async () => {
          const codeReader = new BrowserMultiFormatReader();
          try {
            const result = await codeReader.decodeFromImageElement(imgElement);
            if (result) handleDetected(result.getText());
          } catch (err) {
            console.error("Failed to scan barcode from image:", err);
          }
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
      const resizedImg = resizeImage(img);
      const imgElement = new Image();
      imgElement.src = resizedImg.toDataURL();

      imgElement.onload = async () => {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImageElement(imgElement);
          if (result) handleDetected(result.getText());
        } catch (err) {
          console.error("Failed to scan barcode from image:", err);
          alert("Failed to scan barcode from image. Please check the image quality.");
        }
      };
    };

    img.onerror = () => {
      console.error("Failed to load the uploaded image.");
    };
  };

  const containerStyle = {
    textAlign: "center",
    padding: "0px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headingStyle = { color: "#0b5fff", marginBottom: "5px" };
  const buttonStyle = { padding: "10px 20px", margin: "5px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
  const startButtonStyle = { ...buttonStyle, background: scanning ? "#a0aec0" : "#0b5fff", color: "#fff" };
  const stopButtonStyle = { ...buttonStyle, background: "#ff4d4f", color: "#fff" };
  const scanButtonStyle = { ...buttonStyle, background: "#22c55e", color: "#fff" };
  const videoStyle = { width: "300px", height: "200px", border: "2px solid #0b5fff", borderRadius: "8px", marginTop: "5px" };
  const uploadedImgStyle = { maxWidth: "200px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ccc" };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Barcode Scanner</h2>

      <div>
        <button onClick={startCameraScan} disabled={scanning} style={startButtonStyle}>
          {scanning ? "Scanning..." : "Start Camera Scan"}
        </button>
        {scanning && <button onClick={stopCamera} style={stopButtonStyle}>Stop Camera</button>}
      </div>

      <video ref={videoRef} style={videoStyle} />

      <div style={{ marginTop: "25px" }}>
        <input type="file" accept="image/*" onChange={handleUpload} style={{ marginTop: "10px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }} />
        {uploadedImage && (
          <div style={{ marginTop: "15px" }}>
            <img src={uploadedImage} alt="Uploaded" style={uploadedImgStyle} />
            <br />
            <button onClick={scanUploadedImage} style={scanButtonStyle}>Scan Uploaded Image</button>
          </div>
        )}
      </div>

      {barcode && <p style={{ marginTop: "20px", fontSize: "18px", fontWeight: "600", color: "#1f2937" }}><strong>Scanned Barcode:</strong> {barcode}</p>}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

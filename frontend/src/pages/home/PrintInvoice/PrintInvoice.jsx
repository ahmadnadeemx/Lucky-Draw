import React, { useRef } from "react";
import {
  FaTimes,
  FaDownload,
  FaFilePdf,
  FaImage,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";
import { BsGenderAmbiguous } from "react-icons/bs";
import {
  MdOutlineFileCopy,
  MdPerson,
  MdOutlinePersonPin,
} from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PrintInvoice = ({ member, isOpen, onClose }) => {
  const invoiceRef = useRef(null);

  if (!member || !isOpen) return null;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate age
  const getAge = (dobString) => {
    if (!dobString) return "N/A";
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Download as PDF (A4 size, single page)
  const downloadAsPDF = async () => {
    const input = invoiceRef.current;
    
    try {
      // Set loading state
      const downloadBtn = document.querySelector('[data-download="pdf"]');
      if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="animate-spin">⏳</span> Generating PDF...';
      }

      // Capture the invoice with high quality
      const canvas = await html2canvas(input, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        removeContainer: true,
        width: input.scrollWidth,
        height: input.scrollHeight,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
        onclone: (clonedDoc) => {
          // Remove any buttons or interactive elements from the clone
          const buttons = clonedDoc.querySelectorAll('.no-print, button');
          buttons.forEach(btn => btn.style.display = 'none');
        }
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate aspect ratio
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const aspectRatio = canvasWidth / canvasHeight;

      // Calculate dimensions to fit on A4
      let imgWidth = pageWidth - 20; // 10mm margin on each side
      let imgHeight = imgWidth / aspectRatio;

      // If image is too tall, reduce width to maintain aspect ratio
      if (imgHeight > pageHeight - 20) {
        imgHeight = pageHeight - 20;
        imgWidth = imgHeight * aspectRatio;
      }

      // Calculate centering position
      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = (pageHeight - imgHeight) / 2;

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

      // Add footer text
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        `Invoice: ${member.serialNo} | Generated: ${new Date().toLocaleDateString()} | SS Builder & Prop Interior`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );

      // Save PDF
      pdf.save(`${member.serialNo}_${member.name.replace(/\s+/g, '_')}_Invoice.pdf`);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Reset button state
      const downloadBtn = document.querySelector('[data-download="pdf"]');
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<FaFilePdf className="h-4 w-4" /><span class="hidden md:inline">PDF</span>';
      }
    }
  };

  // Download as Image
  const downloadAsImage = async () => {
    const input = invoiceRef.current;
    
    try {
      // Set loading state
      const downloadBtn = document.querySelector('[data-download="image"]');
      if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="animate-spin">⏳</span> Generating Image...';
      }

      // Capture the invoice
      const canvas = await html2canvas(input, {
        scale: 2, // Good quality for images
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        width: input.scrollWidth,
        height: input.scrollHeight,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
        onclone: (clonedDoc) => {
          // Remove any buttons or interactive elements from the clone
          const buttons = clonedDoc.querySelectorAll('.no-print, button');
          buttons.forEach(btn => btn.style.display = 'none');
        }
      });

      // Create download link
      const link = document.createElement('a');
      const fileName = `${member.serialNo}_${member.name.replace(/\s+/g, '_')}_Invoice.png`;
      
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Image generation error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      // Reset button state
      const downloadBtn = document.querySelector('[data-download="image"]');
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<FaImage className="h-4 w-4" /><span class="hidden md:inline">Image</span>';
      }
    }
  };

  return (
    <>
      {/* Invoice Modal */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaFilePdf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Invoice Preview
                </h2>
                <p className="text-blue-100">
                  {member.name} - Serial No: {member.serialNo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Download PDF Button */}
              <button
                onClick={downloadAsPDF}
                data-download="pdf"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as PDF"
              >
                <FaFilePdf className="h-4 w-4" />
                <span className="hidden md:inline">PDF</span>
              </button>
              
              {/* Download Image Button */}
              <button
                onClick={downloadAsImage}
                data-download="image"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as Image"
              >
                <FaImage className="h-4 w-4" />
                <span className="hidden md:inline">Image</span>
              </button>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Invoice Preview Container */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div
              ref={invoiceRef}
              className="bg-white p-8 rounded-lg border-2 border-gray-200 shadow-inner"
              style={{
                width: "210mm", // A4 width in mm
                minHeight: "297mm", // A4 height in mm
                margin: "0 auto",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                backgroundColor: "#ffffff",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
                pageBreakInside: "avoid",
              }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-50 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

              {/* Invoice Header with Logo and Image */}
              <div className="relative border-b-2 border-blue-200 pb-6 mb-8">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center -mt-5 -mr-1">
                        <span className="text-white font-bold text-xl">SS</span>
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                          Builder & Prop Interior
                        </h1>
                        <p className="text-sm text-gray-600 font-medium">
                          Professional Construction & Interior Solutions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        <FaIdCard className="h-3 w-3" />
                        Registration Invoice
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="h-3 w-3" />
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* User Image in Upper Right Corner */}
                  <div className="w-32 h-32 relative">
                    <div className="absolute -top-2 -right-2 w-36 h-36 flex items-center justify-center">
                      <div className="w-full h-full overflow-hidden border-4 border-white shadow-lg rounded-full">
                        {member.memberImage ? (
                          <img
                            src={member.memberImage}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2">
                            {member.gender === "Male" ? (
                              <GiMale className="h-16 w-16 text-blue-400" />
                            ) : (
                              <GiFemale className="h-16 w-16 text-pink-400" />
                            )}
                            <span className="text-xs text-gray-500 mt-1 text-center">
                              Profile Photo
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Title */}
                <div className="mt-6">
                  <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                    <h2 className="text-xl font-bold text-white">
                      LUCKY DRAW REGISTRATION INVOICE
                    </h2>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Invoice ID:{" "}
                    <span className="font-bold">
                      INV-{member.serialNo}-{new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content - Optimized for single page */}
              <div className="mb-8 relative" style={{ pageBreakInside: 'avoid' }}>
                {/* Key Information Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <MdOutlineFileCopy className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">
                        Serial No
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {member.serialNo}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <MdPerson className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">
                        Membership
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {member.membership}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <MdOutlineFileCopy className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">
                        File No
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {member.fileNo}
                    </div>
                  </div>
                </div>

                {/* Member Details Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
                    <MdOutlinePersonPin className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Member Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {/* Row 1: Name and Father's Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          Full Name
                        </label>
                        <div className="text-lg font-semibold text-gray-900 px-3 py-2 border-b-2 border-gray-300">
                          {member.name}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          Father's Name
                        </label>
                        <div className="text-lg font-semibold text-gray-900 px-3 py-2 border-b-2 border-gray-300">
                          {member.fatherName}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: CNIC, Mobile, Email */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                          <FaIdCard className="h-3 w-3" />
                          CNIC Number
                        </label>
                        <div className="font-mono text-base font-semibold text-gray-900 bg-white px-3 py-2 rounded border border-gray-300">
                          {member.cnic}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                          <FaPhone className="h-3 w-3" />
                          Mobile Number
                        </label>
                        <div className="font-mono text-base font-semibold text-gray-900 bg-white px-3 py-2 rounded border border-gray-300">
                          {member.mobile}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                          <FaEnvelope className="h-3 w-3" />
                          Email Address
                        </label>
                        <div className="text-base font-semibold text-gray-900 bg-white px-3 py-2 rounded border border-gray-300 truncate">
                          {member.email}
                        </div>
                      </div>
                    </div>

                    {/* Row 3: DOB and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                          <FaCalendarAlt className="h-3 w-3" />
                          Date of Birth & Age
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="text-base font-semibold text-gray-900 px-3 py-2 border-b-2 border-gray-300 flex-1">
                            {formatDate(member.dob)}
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                            {getAge(member.dob)} years
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                          <BsGenderAmbiguous className="h-3 w-3" />
                          Gender
                        </label>
                        <div
                          className={`text-lg font-semibold px-3 py-2 rounded-lg border-2 ${
                            member.gender === "Male"
                              ? "border-blue-200 bg-blue-50 text-blue-800"
                              : "border-pink-200 bg-pink-50 text-pink-800"
                          } flex items-center gap-2`}
                        >
                          {member.gender === "Male" ? (
                            <>
                              <GiMale className="h-5 w-5" />
                              Male
                            </>
                          ) : (
                            <>
                              <GiFemale className="h-5 w-5" />
                              Female
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Details */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-blue-300">
                    Registration Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Registration Date
                      </div>
                      <div className="text-base font-semibold text-gray-900">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Registration Status
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Active & Confirmed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-bold">!</span>
                      </div>
                      <h3 className="text-lg font-bold text-red-800">
                        Important Notice & Terms
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm text-red-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="font-semibold">
                          NON-REFUNDABLE PAYMENT:
                        </span>{" "}
                        This payment is non-refundable under any circumstances
                        once processed.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="font-semibold">
                          REGISTRATION BINDING:
                        </span>{" "}
                        Registration fees are final and non-transferable after
                        submission.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="font-semibold">
                          LUCKY DRAW PARTICIPATION:
                        </span>{" "}
                        Amount paid is exclusively for participation in the
                        lucky draw event.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="font-semibold">AGREEMENT:</span> By
                        signing this invoice, you acknowledge and agree to all
                        terms and conditions.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Signatures Section */}
                <div className="mt-10 pt-6 border-t-2 border-gray-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="border-t-2 border-gray-400 pt-4 mt-8">
                        <div className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                          Participant's Signature
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          (Member / Applicant)
                        </div>
                        <div className="mt-4 h-0.5 bg-gray-300 w-3/4 mx-auto"></div>
                        <div className="mt-2 text-xs text-gray-500">
                          Date: ___________________
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border-t-2 border-dashed border-gray-400 pt-4 mt-8">
                        <div className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                          Office Stamp
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          SS Builder & Prop Interior
                        </div>
                        <div className="mt-4 text-xs text-gray-700 italic">
                          Official Stamp Here
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Official Use Only
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border-t-2 border-gray-400 pt-4 mt-8">
                        <div className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                          Authorized Signatory
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          (Official Representative)
                        </div>
                        <div className="mt-4 h-0.5 bg-gray-300 w-3/4 mx-auto"></div>
                        <div className="mt-2 text-xs text-gray-500">
                          Date: ___________________
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-10 pt-6 border-t-2 border-gray-300 text-center">
                  <div className="text-xs text-gray-600 mb-2">
                    {/* <p>
                      This is an electronically generated invoice. No physical
                      signature required for validation.
                    </p> */}
                    {/* <p className="mt-1">
                      Invoice Generated on: {new Date().toLocaleString()}
                    </p> */}
                  </div>
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-lg mt-4">
                    <p className="text-sm font-semibold text-gray-800">
                      Thank you for registering with SS Builder & Prop Interior
                      Lucky Draw!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintInvoice;






























// import React, { useRef } from "react";
// import { FaPrint, FaTimes, FaDownload, FaShare, FaCalendarAlt, FaPhone, FaEnvelope, FaIdCard } from "react-icons/fa";
// import { GiMale, GiFemale } from "react-icons/gi";
// import { BsBuildings } from "react-icons/bs";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const PrintInvoice = ({ member, isOpen, onClose }) => {
//   const invoiceRef = useRef(null);

//   if (!member || !isOpen) return null;

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // Calculate age
//   const getAge = (dobString) => {
//     if (!dobString) return "N/A";
//     const dob = new Date(dobString);
//     const today = new Date();
//     let age = today.getFullYear() - dob.getFullYear();
//     const m = today.getMonth() - dob.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   // Download as PDF
//   const downloadAsPDF = () => {
//     const input = invoiceRef.current;
//     html2canvas(input, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210;
//       const pageHeight = 295;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`${member.serialNo}_${member.name}_Invoice.pdf`);
//     });
//   };

//   // Share as Image
//   const shareAsImage = () => {
//     const input = invoiceRef.current;
//     html2canvas(input, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     }).then((canvas) => {
//       canvas.toBlob((blob) => {
//         const file = new File([blob], `${member.serialNo}_invoice.png`, {
//           type: "image/png",
//         });

//         if (navigator.share && navigator.canShare({ files: [file] })) {
//           navigator.share({
//             title: `Invoice - ${member.name}`,
//             text: `Invoice for ${member.name} - Serial No: ${member.serialNo}`,
//             files: [file],
//           });
//         } else {
//           const link = document.createElement("a");
//           link.download = `${member.serialNo}_${member.name}_Invoice.png`;
//           link.href = canvas.toDataURL();
//           link.click();
//         }
//       });
//     });
//   };

//   // Print the invoice
//   const handlePrint = () => {
//     const printContent = invoiceRef.current.innerHTML;
//     const originalContent = document.body.innerHTML;

//     document.body.innerHTML = printContent;
//     window.print();
//     document.body.innerHTML = originalContent;
//     window.location.reload();
//   };

//   return (
//     <>
//       {/* Print Invoice Modal */}
//       <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
//         <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
//           {/* Modal Header */}
//           <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
//             <div className="flex items-center gap-3">
//               <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                 <FaPrint className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-white">Invoice Preview</h2>
//                 <p className="text-blue-100">
//                   Invoice for {member.name} - Serial No: {member.serialNo}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={downloadAsPDF}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
//                 title="Download PDF"
//               >
//                 <FaDownload className="h-4 w-4" />
//                 <span className="hidden md:inline">PDF</span>
//               </button>
//               <button
//                 onClick={shareAsImage}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
//                 title="Share as Image"
//               >
//                 <FaShare className="h-4 w-4" />
//                 <span className="hidden md:inline">Share</span>
//               </button>
//               <button
//                 onClick={handlePrint}
//                 className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors shadow-lg"
//               >
//                 <FaPrint className="h-4 w-4" />
//                 Print Now
//               </button>
//               <button
//                 onClick={onClose}
//                 className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
//               >
//                 <FaTimes className="h-5 w-5" />
//               </button>
//             </div>
//           </div>

//           {/* Invoice Preview */}
//           <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
//             <div
//               ref={invoiceRef}
//               className="bg-white p-8 rounded-lg border-2 border-gray-200 shadow-inner print:shadow-none print:border-none relative"
//               style={{
//                 width: "210mm",
//                 minHeight: "297mm",
//                 margin: "0 auto",
//                 fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
//                 background: "linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)",
//               }}
//             >
//               {/* Decorative Corner Elements */}
//               <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-cyan-500 transform rotate-45 translate-x-16 -translate-y-16">
//                   <div className="absolute bottom-4 right-4 text-white font-bold text-sm transform -rotate-45">
//                     OFFICIAL COPY
//                   </div>
//                 </div>
//               </div>

//               <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden">
//                 <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 transform -rotate-45 -translate-x-16 -translate-y-16">
//                   <div className="absolute bottom-4 left-4 text-white font-bold text-sm transform rotate-45">
//                     PAID
//                   </div>
//                 </div>
//               </div>

//               {/* Invoice Header */}
//               <div className="border-b-2 border-blue-900 pb-6 mb-8 pt-4">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-3">
//                       <BsBuildings className="h-10 w-10 text-blue-700" />
//                       <div>
//                         <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
//                           SS Builder & Property Interior
//                         </h1>
//                         <p className="text-lg text-cyan-700 font-semibold mb-1">
//                           Lucky Draw Registration Invoice
//                         </p>
//                         <div className="flex items-center gap-4 text-sm text-gray-600">
//                           <span>Registration No: 4567</span>
//                           <span>•</span>
//                           <span>Email: info@ssbuilder.com</span>
//                           <span>•</span>
//                           <span>Phone: +92 300 1234567</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg">
//                       <div className="text-xs font-semibold uppercase tracking-wider">Invoice Date</div>
//                       <div className="text-lg font-bold">{new Date().toLocaleDateString('en-US', { 
//                         year: 'numeric', 
//                         month: 'short', 
//                         day: 'numeric' 
//                       })}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Key Information Banner */}
//               <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-8">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="text-center">
//                     <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Serial No</div>
//                     <div className="text-3xl font-bold text-blue-900 bg-white py-2 rounded-lg shadow-sm">
//                       {member.serialNo}
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Membership Type</div>
//                     <div className="text-2xl font-bold text-green-700 bg-white py-2 rounded-lg shadow-sm">
//                       {member.membership}
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">File No</div>
//                     <div className="text-2xl font-bold text-purple-700 bg-white py-2 rounded-lg shadow-sm">
//                       {member.fileNo}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Main Content - Two Column Layout */}
//               <div className="grid grid-cols-3 gap-8 mb-8">
//                 {/* Left Column - Member Details */}
//                 <div className="col-span-2">
//                   <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b flex items-center gap-2">
//                       <FaIdCard className="text-blue-600" />
//                       Member Information
//                     </h2>
                    
//                     <div className="space-y-6">
//                       {/* Name Row */}
//                       <div className="grid grid-cols-2 gap-6">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
//                           <div className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
//                             {member.name}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Father's Name</label>
//                           <div className="text-lg font-semibold text-gray-900 border-b-2 border-blue-100 pb-2">
//                             {member.fatherName}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Contact Row */}
//                       <div className="grid grid-cols-3 gap-6">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">CNIC Number</label>
//                           <div className="flex items-center gap-2 text-gray-900 border-b-2 border-blue-100 pb-2">
//                             <FaIdCard className="text-gray-400" />
//                             <span className="font-mono font-semibold">{member.cnic}</span>
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number</label>
//                           <div className="flex items-center gap-2 text-gray-900 border-b-2 border-blue-100 pb-2">
//                             <FaPhone className="text-gray-400" />
//                             <span className="font-semibold">{member.mobile}</span>
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
//                           <div className="flex items-center gap-2 text-gray-900 border-b-2 border-blue-100 pb-2">
//                             <FaEnvelope className="text-gray-400" />
//                             <span className="font-semibold">{member.email}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Personal Details Row */}
//                       <div className="grid grid-cols-2 gap-6">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Date of Birth</label>
//                           <div className="flex items-center gap-2 text-gray-900 border-b-2 border-blue-100 pb-2">
//                             <FaCalendarAlt className="text-gray-400" />
//                             <span className="font-semibold">{formatDate(member.dob)}</span>
//                             <span className="text-sm text-gray-500">({getAge(member.dob)} years)</span>
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
//                           <div className="flex items-center gap-2 text-gray-900 border-b-2 border-blue-100 pb-2">
//                             {member.gender === "Male" ? (
//                               <>
//                                 <GiMale className="h-5 w-5 text-blue-600" />
//                                 <span className="font-semibold">Male</span>
//                               </>
//                             ) : (
//                               <>
//                                 <GiFemale className="h-5 w-5 text-pink-600" />
//                                 <span className="font-semibold">Female</span>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Important Notice */}
//                   <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
//                     <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
//                       <span className="text-2xl">⚠️</span>
//                       Important Terms & Conditions
//                     </h3>
//                     <div className="space-y-2">
//                       <p className="text-red-700 font-semibold">
//                         This payment is NON-REFUNDABLE under any circumstances.
//                       </p>
//                       <ul className="space-y-1 text-sm text-red-600">
//                         <li className="flex items-start gap-2">
//                           <span className="text-red-500 font-bold">•</span>
//                           Registration fees are non-refundable once paid
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <span className="text-red-500 font-bold">•</span>
//                           No cancellations or refunds after registration
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <span className="text-red-500 font-bold">•</span>
//                           The amount paid is for participation in the lucky draw only
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <span className="text-red-500 font-bold">•</span>
//                           By signing this invoice, you agree to all terms and conditions
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column - Photo and Status */}
//                 <div className="space-y-6">
//                   {/* Profile Photo Card */}
//                   <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Profile Photo</h3>
//                     <div className="border-4 border-gradient-to-br from-blue-400 to-cyan-400 rounded-lg p-2 bg-gradient-to-br from-blue-50 to-cyan-50">
//                       <div className="w-full aspect-square rounded overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
//                         {member.memberImage ? (
//                           <img
//                             src={member.memberImage}
//                             alt={member.name}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             {member.gender === "Male" ? (
//                               <GiMale className="h-32 w-32 text-gray-300" />
//                             ) : (
//                               <GiFemale className="h-32 w-32 text-gray-300" />
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="mt-3 text-center text-sm text-gray-600">
//                       Member ID: {member.serialNo}
//                     </div>
//                   </div>

//                   {/* Status Card */}
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Registration Status</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Status:</span>
//                         <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
//                           ACTIVE
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Issued On:</span>
//                         <span className="font-semibold">{new Date().toLocaleDateString()}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600">Valid Until:</span>
//                         <span className="font-semibold text-green-700">31 Dec 2024</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Signatures Section */}
//               <div className="mt-12 pt-8 border-t-2 border-gray-200">
//                 <div className="grid grid-cols-3 gap-8">
//                   <div className="text-center">
//                     <div className="h-20 border-b-2 border-gray-300 mb-4"></div>
//                     <div className="font-semibold text-gray-800">Participant's Signature</div>
//                     <div className="text-sm text-gray-600 mt-1">(Member)</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="h-20 border-b-2 border-gray-300 mb-4 relative">
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="text-gray-400 italic">Company Stamp Here</div>
//                       </div>
//                     </div>
//                     <div className="font-semibold text-gray-800">Office Stamp</div>
//                     <div className="text-sm text-gray-600 mt-1">SS Builder & Property Interior</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="h-20 border-b-2 border-gray-300 mb-4"></div>
//                     <div className="font-semibold text-gray-800">Authorized Signatory</div>
//                     <div className="text-sm text-gray-600 mt-1">(Official Representative)</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="mt-8 pt-6 border-t-2 border-gray-300">
//                 <div className="text-center">
//                   <p className="text-lg font-bold text-blue-900 mb-2">
//                     Thank you for registering with SS Builder & Property Interior Lucky Draw!
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     For any queries, contact us at info@ssbuilder.com or call +92 300 1234567
//                   </p>
//                   <div className="mt-4 text-xs text-gray-500 flex justify-center items-center gap-4">
//                     <span>Invoice ID: INV-{member.serialNo}</span>
//                     <span>•</span>
//                     <span>Generated on: {new Date().toLocaleString()}</span>
//                     <span>•</span>
//                     <span>Page 1 of 1</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Watermark */}
//               <div className="absolute inset-0 pointer-events-none opacity-5">
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-8xl font-bold text-gray-400 transform rotate-45">
//                     SS BUILDER
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           #print-area,
//           #print-area * {
//             visibility: visible;
//           }
//           #print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default PrintInvoice;
import React, { useRef } from "react";
import { FaPrint, FaTimes, FaDownload, FaShare } from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";
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

  // Download as PDF
  const downloadAsPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${member.serialNo}_${member.name}_Invoice.pdf`);
    });
  };

  // Share as Image
  const shareAsImage = () => {
    const input = invoiceRef.current;
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], `${member.serialNo}_invoice.png`, {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          navigator.share({
            title: `Invoice - ${member.name}`,
            text: `Invoice for ${member.name} - Serial No: ${member.serialNo}`,
            files: [file],
          });
        } else {
          // Fallback: Download the image
          const link = document.createElement("a");
          link.download = `${member.serialNo}_${member.name}_Invoice.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      });
    });
  };

  // Print the invoice
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <>
      {/* Print Invoice Modal */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaPrint className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Print Invoice</h2>
                <p className="text-blue-100">
                  Invoice for {member.name} - Serial No: {member.serialNo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={downloadAsPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                title="Download PDF"
              >
                <FaDownload className="h-4 w-4" />
                <span className="hidden md:inline">PDF</span>
              </button>
              <button
                onClick={shareAsImage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                title="Share as Image"
              >
                <FaShare className="h-4 w-4" />
                <span className="hidden md:inline">Share</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                <FaPrint className="h-4 w-4" />
                Print Now
              </button>
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div
              ref={invoiceRef}
              className="bg-white p-8 rounded-lg border-2 border-gray-200 shadow-inner print:shadow-none print:border-none"
              style={{
                width: "210mm",
                minHeight: "297mm",
                margin: "0 auto",
                fontFamily: "'Times New Roman', serif",
              }}
            >
              {/* Invoice Header */}
              <div className="border-b border-blue-900 pb-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-bold text-blue-900 mb-2">
                      SS Builder & Prop Interior
                    </h1>
                    <p className="text-lg text-gray-700 mb-1">
                      Lucky Draw Registration
                    </p>
                    4567 | Email: info@ssbuilder.com
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="mb-8">
                {/* Top Row: Serial No, Membership, File No in one line without boxes */}
                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Serial No</div>
                    <div className="text-2xl font-bold text-blue-900 border-b-2 border-gray-300 pb-1">
                      {member.serialNo}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Membership</div>
                    <div className="text-2xl font-bold text-green-700 border-b-2 border-gray-300 pb-1">
                      {member.membership}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">File No</div>
                    <div className="text-2xl font-bold text-purple-700 border-b-2 border-gray-300 pb-1">
                      {member.fileNo}
                    </div>
                  </div>
                </div>

                {/* Member Details - Simple fields like the image */}
                <div className="space-y-6">
                  {/* Row 1: Name and Father's Name */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Name</div>
                      <div className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">
                        {member.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Father's Name
                      </div>
                      <div className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">
                        {member.fatherName}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: CNIC, Mobile, Email */}
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">CNIC</div>
                      <div className="text-lg font-semibold text-gray-900 border-b-2 border-gray-300 pb-1">
                        {member.cnic}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Mobile</div>
                      <div className="text-lg font-semibold text-gray-900 border-b-2 border-gray-300 pb-1">
                        {member.mobile}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Email</div>
                      <div className="text-lg font-semibold text-gray-900 border-b-2 border-gray-300 pb-1">
                        {member.email}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: DOB and Gender */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Date of Birth
                      </div>
                      <div className="text-lg font-semibold text-gray-900 border-b-2 border-gray-300 pb-1">
                        {formatDate(member.dob)} ({getAge(member.dob)} years)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Gender</div>
                      <div className="text-lg font-semibold text-gray-900 border-b-2 border-gray-300 pb-1 flex items-center gap-2">
                        {member.gender === "Male" ? (
                          <>
                            <GiMale className="h-5 w-5 text-blue-600" />
                            Male
                          </>
                        ) : (
                          <>
                            <GiFemale className="h-5 w-5 text-pink-600" />
                            Female
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Image Section */}
              <div className="flex items-center justify-end mb-8">
                <div className="text-center">
                  <div className="border-4 border-blue-900 p-2 rounded-lg mb-2">
                    <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
                      {member.memberImage ? (
                        <img
                          src={member.memberImage}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {member.gender === "Male" ? (
                            <GiMale className="h-24 w-24 text-gray-400" />
                          ) : (
                            <GiFemale className="h-24 w-24 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Profile Photo</div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="pt-4">
                <h3 className="text-lg font-bold text-red-700 mb-2">
                  Important Notice:
                </h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-red-700 font-semibold">
                    ⚠️ This payment is NON-REFUNDABLE under any circumstances.
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-red-600">
                    <li>• Registration fees are non-refundable once paid</li>
                    <li>• No cancellations or refunds after registration</li>
                    <li>
                      • The amount paid is for participation in the lucky draw
                      only
                    </li>
                    <li>
                      • By signing this invoice, you agree to all terms and
                      conditions
                    </li>
                  </ul>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-8 grid grid-cols-3 gap-8 border-t-2 border-gray-300 pt-6">
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 pt-4 mt-8">
                    <div className="font-semibold">Participant's Signature</div>
                    <div className="text-sm text-gray-600">(Member)</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 pt-4 mt-8">
                    <div className="font-semibold">Office Stamp</div>
                    <div className="text-sm text-gray-600">
                      SS Builder & Prop Interior
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 pt-4 mt-8">
                    <div className="font-semibold">Authorized Signatory</div>
                    <div className="text-sm text-gray-600">
                      (Official Representative)
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t-2 border-gray-300 text-center text-sm text-gray-600">
                <p className="mt-1 font-semibold">
                  Thank you for registering with SS Builder & Prop Interior
                  Lucky Draw!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles (hidden except for printing) */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area,
          #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default PrintInvoice;

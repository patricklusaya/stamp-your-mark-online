
export const getPlaceholderText = (stampType: string): string => {
  switch (stampType) {
    case "notary-circle":
      return "YOUR NAME\nNOTARY\nPUBLIC";
    case "business-rectangle":
      return "COMPANY NAME\nESTABLISHED 2024\nPROFESSIONAL SERVICES";
    case "address-rectangle":
      return "John Smith\n123 Main Street\nNew York, NY 10001";
    case "signature-oval":
      return "JOHN SMITH\nSIGNATURE\nAUTHORIZED";
    case "logo-square":
      return "LOGO\nCOMPANY";
    case "paid-circle":
      return "COMPANY FULL NAME\nFINANCE DEPARTMENT";
    default:
      return "Your Custom Text";
  }
};

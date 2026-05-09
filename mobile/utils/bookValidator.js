const textRegex = /^[A-Za-z0-9\s.,'-]+$/;
const descriptionRegex = /^[A-Za-z0-9\s.,'"\-?!()]{0,2000}$/;


const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png"
];

export const validateBookInput = ({
  title,
  author,
  description,
  file,
  fileLink,
  selectedType
}) => {
  // TITLE
  if (!title || !textRegex.test(title.trim())) {
    return "title is required  with  a valid format (letters, numbers, basic punctuation only)";
  }
  if(typeof title !== "string" || title.trim().length === 0) {
    return "Title is required";
  }
  if (author) {
  const trimmed = author.trim();

  if (
    typeof author !== "string" ||
    !textRegex.test(trimmed)
  ) {
    return res.status(400).json({
      message: "Valid author field is required (letters)"
    });
  }
}
    if(description!=null && (typeof description !== "string" || !descriptionRegex.test(description.trim()))) {
      return "valid description  must contain only letters, numbers, and basic punctuation and be up to 2000 characters";
    }

  // TYPE LOGIC
  if ((selectedType === "doc" || selectedType === "reading") && !file) {
    return "File is required";
  }

  if (selectedType === "link" && !fileLink) {
    return "Link is required";
  }

  // FILE VALIDATION (basic)
  if (file) {
    if (!allowedMimeTypes.includes(file.mimeType)) {
      return "Unsupported file type";
    }
  }

  // LINK VALIDATION
  if (fileLink) {
    try {
      const url = new URL(fileLink.trim());

      if (url.protocol !== "https:") {
        return "provide only valid HTTPS URl from trusted sources";
      }
    } catch {
      return "Invalid URL";
    }
  }

  return null; // ✅ valid
};
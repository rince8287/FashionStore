import { FiCamera } from "react-icons/fi";

function ProfileAvatar({
  image,
  name,
  size = "lg",
  editable = false,
  onImageChange,
}) {
  const sizes = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40",
  };

  const buttonSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  const handleFileChange = (event) => {
    if (!onImageChange) return;

    const file = event.target.files?.[0];

    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="relative inline-flex">

      {/* Avatar */}

      <img
        src={image}
        alt={name}
        className={`${sizes[size]} rounded-full border-4 border-[var(--color-border-subtle)] object-cover bg-[var(--color-surface)] shadow-lg`}
      />

      {/* Edit Button */}

      {editable && (
        <label
          className={`absolute bottom-0 right-0 ${buttonSizes[size]} flex cursor-pointer items-center justify-center rounded-full bg-[var(--color-accent)] text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[var(--color-accent-hover)]`}
        >
          <FiCamera size={18} />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

    </div>
  );
}

export default ProfileAvatar;
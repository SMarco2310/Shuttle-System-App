import ReactDOM from "react-dom";
import { useState } from "react";

function EditLocation({ location, onSave, onClose }) {
  const [newName, setNewName] = useState(location?.name || "");
  const [newPrice, setNewPrice] = useState(location?.price || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...location, name: newName, price: newPrice });
    onClose();
  };

  // useEffect(() => {
  //   const handleKeyPress = (e) => {
  //     if (e.key === "Escape") {
  //       setShowSidebar(false);
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyPress);
  //   return () => document.removeEventListener("keydown", handleKeyPress);
  // }, []);
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Location</h2>
        <form onSubmit={handleSubmit}>
          <label>Location Name:</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <label>Price:</label>
          <input
            type="number"
            min="0"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            required
          />
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal"),
  );
}

export default EditLocation;

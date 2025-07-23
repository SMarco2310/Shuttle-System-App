import ReactDOM from "react-dom";
import { useState } from "react";

function CreateLocation({ onCreate, onClose }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const location = { location_name: name, price: parseFloat(price) };
    onCreate(location);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Create New Location</h2>
        <form onSubmit={handleSubmit}>
          <label>Location Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Price:</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <div className="modal-buttons">
            <button style={{ backgroundColor: "green" }} type="submit">
              Create
            </button>
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

export default CreateLocation;

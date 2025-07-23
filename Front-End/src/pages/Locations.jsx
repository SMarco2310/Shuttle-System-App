import { useEffect, useState } from "react";
import EditLocation from "../overLays/EditLocation";
import CreateLocation from "../overLays/CreateLocation";

function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const handleSave = async (location) => {
    try {
      const res = await fetch(
        `http://localhost:3000/admin/locations/${location.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(location),
        },
      );
      if (res.ok) {
        setLocations(
          locations.map((loc) => (loc.id === location.id ? location : loc)),
        );
      } else {
        console.error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  // Fetch all locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/locations");
        const data = await res.json();
        setLocations(
          data.sort((a, b) => a.location_name.localeCompare(b.location_name)),
        );
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  // Delete location
  const deleteLocation = async (id) => {
    const confirm = window.confirm("Delete this location?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/locations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLocations(locations.filter((loc) => loc.id !== id));
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // Placeholder edit handler

  // Placeholder create handler
  const handleCreate = async (location) => {
    try {
      const res = await fetch("http://localhost:3000/admin/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });
      if (res.ok) {
        const newLocation = await res.json();
        setLocations([...locations, newLocation]);
        setIsCreating(false);
      } else {
        console.error("Failed to create");
      }
    } catch (error) {
      console.error("Error creating:", error);
    }
  };

  return (
    <div className="locations-container">
      <div className="locations-header">
        <h1>Locations</h1>
        <button className="create-btn" onClick={() => setIsCreating(true)}>
          + New Location
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <div className="location-cards">
          {locations.map((loc) => (
            <div className="location-card" key={loc.id}>
              <h3>{toTitleCase(loc.location_name)}</h3>
              <p>
                <strong>Price:</strong> {parseFloat(loc.price).toFixed(2)} GHC
              </p>
              <div className="card-buttons">
                <button
                  className="edit-btn"
                  onClick={() => setSelectedLocation(loc)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteLocation(loc.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedLocation && (
        <EditLocation
          location={selectedLocation}
          onSave={handleSave}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      {isCreating && (
        <CreateLocation
          onCreate={handleCreate}
          onClose={() => setIsCreating(false)}
        />
      )}
    </div>
  );
}

export default Locations;

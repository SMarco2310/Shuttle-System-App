function BookingDetails(props) {
  const { booking, bookingIndex } = props;
  const { pickupLocation, dropoffLocation, bookingTime, price, status } =
    booking;

  const [date, time] = bookingTime.split("T");
  const [hour, minute, second] = time.split(":");
  const [s] = second.split(".");

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return (
    <div className="booking-card" key={bookingIndex}>
      <img
        src="/public/booking-img.png"
        alt="Booking"
        className="booking-image"
      />
      <div className="booking-info">
        <div className="info-item">
          <strong>Pick-Up Location:</strong> {toTitleCase(pickupLocation)}
        </div>
        <div className="info-item">
          <strong>Drop-Off Location:</strong> {toTitleCase(dropoffLocation)}
        </div>
        <div className="info-item">
          <strong>Booking date:</strong> {date}
        </div>
        <div className="info-item">
          <strong>Booking time:</strong> {hour}:{minute}:{s}
        </div>
        <div className="info-item">
          <strong>Status:</strong> {toTitleCase(status)}
        </div>
        <div className="info-item">
          <strong>Price:</strong> {price} GHC
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;

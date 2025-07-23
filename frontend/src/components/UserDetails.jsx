function UserDetails(props) {
  const { user } = props;

  return (
    <div className="user-details">
      <img
        src="/public/profile.png"
        alt={user?.name}
        className="profile-image"
      />
      <div className="user-info">
        <h2>{user?.name}</h2>
        <p>Email: {user?.email}</p>
        <p>Phone: {user?.phone}</p>
      </div>
    </div>
  );
}

export default UserDetails;

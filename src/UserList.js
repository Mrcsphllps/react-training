function UserList() {
  const users = ["Marcus", "Sarah", "Isaac", "Robina"];

  return (
    <div>
      <h3>Team Members</h3>

      {users.map((user, index) => (
        <p key={index}>{user}</p>
      ))}
    </div>
  );
}

export default UserList;
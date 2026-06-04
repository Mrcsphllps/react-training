import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function PollList() {
  
const [question, setQuestion] = useState("");
const [option1, setOption1] = useState("");
const [option2, setOption2] = useState("");
const [option3, setOption3] = useState("");
const [polls, setPolls] = useState([]);
const [editingPollId, setEditingPollId] = useState(null);
const [editQuestion, setEditQuestion] = useState("");
const [editOptions, setEditOptions] = useState([]);
const [isSaving, setIsSaving] = useState(false);
const [isCreating, setIsCreating] = useState(false);
const currentUser = JSON.parse(localStorage.getItem("user"));
const [myVotes, setMyVotes] = useState({});
const [profileStats, setProfileStats] = useState(null);
const [myPolls, setMyPolls] = useState([]);
const [category, setCategory] = useState("Gaming");
const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchPolls = () => {
  fetch("http://localhost:5000/api/polls", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
    .then((response) => response.json())
    .then((data) => setPolls(data))
    .catch((error) => console.error("Error fetching polls:", error));
};

useEffect(() => {
  fetchPolls();
  fetchMyVotes();
  fetchProfileStats();
  fetchMyPolls();
}, []);

function fetchMyVotes() {
  fetch("http://localhost:5000/api/polls/my-votes", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => setMyVotes(data))
    .catch((error) => console.error("Error fetching my votes:", error));
}

function getTotalVotes(poll) {
  return poll.options.reduce(
    (sum, option) => sum + option.voteCount,
    0
  );
}

function getVotePercentage(poll, option) {
  const totalVotes = getTotalVotes(poll);

  if (totalVotes === 0) {
    return 0;
  }

  return Math.round(
    (option.voteCount / totalVotes) * 100
  );
}

function fetchProfileStats() {
  fetch("http://localhost:5000/api/users/me/stats", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => setProfileStats(data))
    .catch((error) => console.error("Error fetching profile stats:", error));
}

function fetchMyPolls() {
  fetch("http://localhost:5000/api/users/me/polls", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => setMyPolls(data))
    .catch((error) => console.error("Error fetching my polls:", error));
}

  function vote(pollId, choiceId) {
  fetch(`http://localhost:5000/api/polls/${pollId}/vote/${choiceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {

  response.text().then((message) => {

    if (message.includes("own poll")) {
      toast.error("You cannot vote on your own poll.");
    } else {
      toast.error("Vote not allowed. You may have already voted or you own this poll.");
    }

  });

  return;
}

      fetchPolls();
    })
    .catch((error) => console.error("Error voting:", error));
}

function createPoll() {

  setIsCreating(true);

  fetch("http://localhost:5000/api/polls", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
    body: JSON.stringify({
  question: question,
  category: category,
  options: [
  { text: option1 },
  { text: option2 },
  { text: option3 },
],
    }),
  })
    .then((response) => response.json())
    .then((newPoll) => {
      setIsCreating(false);
      toast.success("Poll created successfully!");
      setPolls([...polls, newPoll]);
      setQuestion("");
      setOption1("");
setOption2("");
setOption3("");
    })
    .catch((error) => {
  setIsCreating(false);
  console.error("Error creating poll:", error);
  toast.error("Failed to create poll.");
});
}

function deletePoll(pollId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this poll?"
  );

  if (!confirmed) {
    return;
  }

  fetch(`http://localhost:5000/api/polls/${pollId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
   .then((response) => {
  if (!response.ok) {
    throw new Error("Delete failed");
  }

  setPolls(polls.filter((poll) => poll.id !== pollId));
  toast.success("Poll deleted successfully!");
})
.catch((error) => {
  console.error("Error deleting poll:", error);
  toast.error("You can only delete polls you created.");
});
}
const cancelEdit = () => {
  setEditingPollId(null);
  setEditQuestion("");
  setEditOptions([]);
};

const updatePoll = async (pollId) => {
  try {
    setIsSaving(true);

    const response = await fetch(`http://localhost:5000/api/polls/${pollId}`, {
      method: "PUT",
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
      body: JSON.stringify({
        question: editQuestion,
        options: editOptions
      }),
    });

    if (!response.ok) {
  throw new Error("Update failed");
}

toast.success("Poll updated successfully!");

    setIsSaving(false);
    
    fetchPolls();

    setEditingPollId(null);

  } catch (error) {
  setIsSaving(false);
  console.error("Error updating poll:", error);
  toast.error("You can only edit polls you created.");
}

};
  return (
    <div>
      <h2>Gaming Polls</h2>
      
      {profileStats && (
  <div className="profile-summary">
    <div className="profile-avatar">
      {profileStats.username.charAt(0).toUpperCase()}
    </div>

    <div>
      <h3>{profileStats.username}</h3>
      <p>{profileStats.email}</p>

      <div className="profile-stats">
        <div>
          <strong>{profileStats.pollCount}</strong>
          <span> Polls</span>
        </div>

        <div>
          <strong>{profileStats.voteCount}</strong>
          <span> Votes</span>
        </div>
      </div>
    </div>
  </div>
)}

<div className="my-polls-section">
  <h3>My Polls</h3>

  {myPolls.length > 0 ? (
    <ul>
      {myPolls.map((poll) => (
        <li key={poll.id}>{poll.question}</li>
      ))}
    </ul>
  ) : (
    <p>You have not created any polls yet.</p>
  )}
</div>

<div className="category-filter">
  <label>View Category: </label>

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="All">All Categories</option>
    <option value="Gaming">Gaming</option>
    <option value="Technology">Technology</option>
    <option value="Sports">Sports</option>
    <option value="Movies">Movies</option>
    <option value="Music">Music</option>
  </select>
</div>

      <div className="poll-form">

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="Gaming">Gaming</option>
  <option value="Technology">Technology</option>
  <option value="Sports">Sports</option>
  <option value="Movies">Movies</option>
  <option value="Music">Music</option>
</select>

      <input
  type="text"
  placeholder="Enter poll question"
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
/>

<input
  type="text"
  placeholder="Option 1"
  value={option1}
  onChange={(e) => setOption1(e.target.value)}
/>

<input
  type="text"
  placeholder="Option 2"
  value={option2}
  onChange={(e) => setOption2(e.target.value)}
/>

<input
  type="text"
  placeholder="Option 3"
  value={option3}
  onChange={(e) => setOption3(e.target.value)}
/>

  <button onClick={createPoll} disabled={isCreating}>
  {isCreating ? "Creating..." : "Create Poll"}
</button>
</div>

      {polls.length === 0 ? (
  <p className="empty-message">
    No polls available yet. Create your first poll above.
  </p>
) : (
  polls
    .filter(
      (poll) =>
        selectedCategory === "All" ||
        poll.category === selectedCategory
    )
    .map((poll) => (
      <div className="poll-card" key={poll.id}>
          {editingPollId === poll.id ? (
            <>
            <h3>Editing Poll</h3>
              <input
                type="text"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
              />


            </>
          ) : (
            <>
  <h3>{poll.question}</h3>

  <p className="created-by">
  Category: {poll.category || "Uncategorized"}
</p>

  <p className="created-by">
    Created by {poll.user ? poll.user.username : "Unknown"}
  </p>
</>
          )}

          {editingPollId !== poll.id &&
  currentUser &&
  poll.user &&
  poll.user.id === currentUser.id && (
    <>
    </>
)}

{editingPollId !== poll.id &&
  currentUser &&
  poll.user &&
  poll.user.id === currentUser.id && (
    <>
      <button
        className="edit-button"
        onClick={() => {
          setEditingPollId(poll.id);
          setEditQuestion(poll.question);
          setEditOptions(poll.options.map((option) => ({ ...option })));
        }}
      >
        Edit Poll
      </button>

      <button
        className="delete-button"
        onClick={() => deletePoll(poll.id)}
      >
        Delete Poll
      </button>
    </>
)}

  {editingPollId === poll.id ? (
  <>
  {editOptions.map((option, index) => (
    <input
      className="edit-option-input"
      key={option.id}
      type="text"
      value={option.text}
      onChange={(e) => {
        const updatedOptions = [...editOptions];
        updatedOptions[index].text = e.target.value;
        setEditOptions(updatedOptions);
      }}
    />
  ))}
  <div className="edit-actions">
  <button
  className="edit-button"
  onClick={() => updatePoll(poll.id)}
  disabled={isSaving}
>
  {isSaving ? "Saving..." : "Save"}
</button>

  <button
    className="delete-button"
    onClick={cancelEdit}
  >
    Cancel
  </button>
</div>
  </>
) : poll.options && poll.options.length > 0 ? (
  poll.options.map((option) => (
    <button
      className="choice-button"
      key={option.id}
      onClick={() => vote(poll.id, option.id)}
    >
      {option.text} - Votes: {option.voteCount} ({getVotePercentage(poll, option)}%)
      {Number(myVotes[poll.id]) === Number(option.id) ? " ✓ You voted" : ""}
    </button>
  ))
) : (
        <p>No options available yet.</p>
    )}
  </div>
))
)}
</div>
);
}

export default PollList;
import { useEffect, useState } from "react";

function PollList() {
  
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
const [option2, setOption2] = useState("");
const [option3, setOption3] = useState("");
  const [polls, setPolls] = useState([]);
const [editingPollId, setEditingPollId] = useState(null);
const [editQuestion, setEditQuestion] = useState("");
const [editOptions, setEditOptions] = useState([]);

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
}, []);

  function vote(pollId, choiceId) {
    fetch(`http://localhost:5000/api/polls/${pollId}/vote/${choiceId}`, {
      method: "POST",
    })
      .then(() => fetchPolls())
      .catch((error) => console.error("Error voting:", error));
  }

  function createPoll() {
    if (!question || !option1 || !option2 || !option3) {
  alert("Please fill in the question and all three options.");
  return;
}
  fetch("http://localhost:5000/api/polls", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
    body: JSON.stringify({
      question: question,
      options: [
  { text: option1 },
  { text: option2 },
  { text: option3 },
],
    }),
  })
    .then((response) => response.json())
    .then((newPoll) => {
      setPolls([...polls, newPoll]);
      setQuestion("");
      setOption1("");
setOption2("");
setOption3("");
    })
    .catch((error) => console.error("Error creating poll:", error));
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
    .then(() => {
      setPolls(polls.filter((poll) => poll.id !== pollId));
    })
    .catch((error) => console.error("Error deleting poll:", error));
}

const cancelEdit = () => {
  setEditingPollId(null);
  setEditQuestion("");
  setEditOptions([]);
};

const updatePoll = async (pollId) => {
  try {

    await fetch(`http://localhost:5000/api/polls/${pollId}`, {
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

    fetchPolls();

    setEditingPollId(null);

  } catch (error) {
    console.error("Error updating poll:", error);
  }
};
  return (
    <div>
      <h2>Gaming Polls</h2>

      <div className="poll-form">
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

  <button onClick={createPoll}>Create Poll</button>
</div>

      {polls.length === 0 ? (
  <p className="empty-message">
  No polls available yet. Create your first poll above.
</p>
) : (
  polls.map((poll) => (
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
            <h3>{poll.question}</h3>
          )}

          {editingPollId !== poll.id && (
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
)}

{editingPollId !== poll.id && (
<button
  className="delete-button"
  onClick={() => deletePoll(poll.id)}
>
  Delete Poll
</button>
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
  >
    Save
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
      {option.text} - Votes: {option.voteCount}
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
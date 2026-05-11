import { useEffect, useState } from "react";

function PollList() {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
const [option2, setOption2] = useState("");
const [option3, setOption3] = useState("");
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/polls")
      .then((response) => response.json())
      .then((data) => setPolls(data))
      .catch((error) => console.error("Error fetching polls:", error));
  }, []);
       function vote(pollId, choiceId) {
  fetch(`http://localhost:5000/api/polls/${pollId}/vote/${choiceId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then(() => {
      fetch("http://localhost:5000/api/polls")
        .then((response) => response.json())
        .then((data) => setPolls(data));
    })
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
  return (
    <div>
      <h2>Gaming Polls</h2>

      <div>
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

      {polls.map((poll) => (
        <div className="poll-card" key={poll.id}>
          <h3>{poll.question}</h3>

          {poll.options.map((option) => (
           <button className="choice-button" key={option.id} onClick={() => vote(poll.id, option.id)}>
              {option.text} - Votes: {option.voteCount}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PollList;
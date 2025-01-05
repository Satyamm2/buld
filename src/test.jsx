import React, { useState } from "react";
import { TextField, Autocomplete, Box, Button } from "@mui/material";

// Sample users
const fetchedUsers = [
  {
    id: 111,
    first_name: "Buyer",
    last_name: "",
    email: "buyer@expressolutionlab.com",
    avatar: "",
  },
  {
    id: 112,
    first_name: "Approver",
    last_name: "",
    email: "approver@expressolutionlab.com",
    avatar: "",
  },
  {
    id: 113,
    first_name: "manager",
    last_name: "",
    email: "manager@expressolutionlab.com",
    avatar: "",
  },
  {
    id: 114,
    first_name: "Buyer",
    last_name: "",
    email: "buyer1@expressolutionlab.com",
    avatar: "",
  },
  {
    id: 115,
    first_name: "Om",
    last_name: "",
    email: "om@expressolutionlab.com",
    avatar: "",
  },
  {
    id: 116,
    first_name: "sam",
    last_name: "",
    email: "sam@expressolutionlab.com",
    avatar: "",
  },
  {
    id: 117,
    first_name: "sam",
    last_name: "",
    email: "sam1@expressolutionlab.com",
    avatar: "",
  },
  {
    id: 118,
    first_name: "sam",
    last_name: "",
    email: "sam2@expressolutionlab.com",
    avatar: "",
  },
];

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [emails, setEmails] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Function to extract the word after the '@' symbol, but stop if there's a space
  const extractMention = (value) => {
    const mentionMatch = value.match(/@(\w*)$/);
    return mentionMatch ? mentionMatch[1] : "";
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const mention = extractMention(value);

    if (value.includes("@")) {
      // If there's a mention, show autocomplete only for the active mention
      if (mention !== "") {
        const filtered = fetchedUsers.filter((user) =>
          user.first_name.toLowerCase().startsWith(mention.toLowerCase())
        );
        setFilteredUsers(filtered);
        setShowAutocomplete(true);
      } else if (mention === "") {
        // Don't show autocomplete if there's a space after @
        setShowAutocomplete(false);
      }
    } else {
      setShowAutocomplete(false);
    }

    // Remove emails if mention is deleted from input
    const updatedEmails = emails.filter((email) =>
      value.includes(email.first_name)
    );
    setEmails(updatedEmails);
  };

  // Handle user selection from the autocomplete
  const handleUserSelect = (event, selectedUser) => {
    if (selectedUser) {
      const mention = extractMention(inputValue);
      const newInputValue = inputValue.replace(
        `@${mention}`,
        `@${selectedUser.first_name}`
      );
      setInputValue(newInputValue);

      // Add selected user's email to the list if not already added
      if (!emails.some((email) => email.email === selectedUser.email)) {
        setEmails([...emails, selectedUser]);
      }

      setShowAutocomplete(false);
    }
  };

  const handleSubmit = () => {
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ width: 300, margin: "0 auto", mt: 5 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type your message"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Mention a user with @"
        />

        {showAutocomplete && (
          <Autocomplete
            open={showAutocomplete}
            onClose={() => setShowAutocomplete(false)}
            options={filteredUsers}
            getOptionLabel={(option) => option.first_name}
            onChange={handleUserSelect}
            renderInput={(params) => <TextField {...params} label="Mention" />}
          />
        )}

        {/* Display the selected emails */}
        {emails.length > 0 && (
          <Box mt={2}>
            <strong>Selected Emails:</strong>
            <ul>
              {emails.map((user) => (
                <li key={user.id}>{user.email}</li>
              ))}
            </ul>
          </Box>
        )}

        <Box>
          <Button type="submit">Save</Button>
        </Box>
      </Box>
    </form>
  );
};

export default Home;

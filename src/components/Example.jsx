import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Button,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";

// Sample users
const fetchedUsers = [
  {
    id: 111,
    first_name: "Buyer",
    last_name: "",
    email: "buyer@expressolutionlab.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 112,
    first_name: "Approver",
    last_name: "",
    email: "approver@expressolutionlab.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 113,
    first_name: "manager",
    last_name: "",
    email: "manager@expressolutionlab.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 114,
    first_name: "Buyer",
    last_name: "",
    email: "buyer1@expressolutionlab.com",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 115,
    first_name: "Om",
    last_name: "",
    email: "om@expressolutionlab.com",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 116,
    first_name: "sam",
    last_name: "",
    email: "sam@expressolutionlab.com",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 117,
    first_name: "sam",
    last_name: "",
    email: "sam1@expressolutionlab.com",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 118,
    first_name: "sam",
    last_name: "",
    email: "sam2@expressolutionlab.com",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
];

const Example = () => {
  const [inputValue, setInputValue] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [emails, setEmails] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [caretPosition, setCaretPosition] = useState(0);

  // Function to extract the word after the '@' symbol from the current caret position
  const extractMention = (value, position) => {
    const beforeCaret = value.slice(0, position);
    const mentionMatch = beforeCaret.match(/@(\w*)$/);
    return mentionMatch ? mentionMatch[1] : "";
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const value = event.target.value;
    const caret = event.target.selectionStart;
    setInputValue(value);
    setCaretPosition(caret);

    const mention = extractMention(value, caret);

    if (value.includes("@")) {
      if (mention === "" && value[caret - 1] === "@") {
        // If only @ is typed without any word after, show all users
        setFilteredUsers(fetchedUsers);
        setShowAutocomplete(true);
      } else if (mention !== "") {
        // Filter users based on the mention string after '@'
        const filtered = fetchedUsers.filter((user) =>
          user.first_name.toLowerCase().startsWith(mention.toLowerCase())
        );
        setFilteredUsers(filtered);
        setShowAutocomplete(true);
      } else if (value[caret - 1] === " ") {
        // Close autocomplete if there's a space after @
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
      const mention = extractMention(inputValue, caretPosition);
      const startIndex = inputValue.lastIndexOf(`@${mention}`, caretPosition);

      // Replace only the mention at the current caret position
      const newInputValue =
        inputValue.slice(0, startIndex) +
        `@${selectedUser.first_name}` +
        inputValue.slice(caretPosition);
      setInputValue(newInputValue);

      // Add selected user's email to the list if not already added
      if (!emails.some((email) => email.email === selectedUser.email)) {
        setEmails([...emails, selectedUser]);
      }

      setShowAutocomplete(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputValue);
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
          onClick={(e) => setCaretPosition(e.target.selectionStart)}
          onKeyUp={(e) => setCaretPosition(e.target.selectionStart)}
        />

        {/* {showAutocomplete && filteredUsers.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '100%',
                  width: '80%', 
                  maxHeight: 200, 
                  overflowY: 'auto', 
                  backgroundColor: theme.palette.background.paper,
                  zIndex: 10, 
                  borderRadius: 1
                }}
              >
                {filteredUsers?.map(option => (
                  <Box
                    key={option.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                    onClick={() => handleUserSelect(null, option)} // Handle the selection
                  >
                    <ListItemAvatar>
                    <Avatar src={`data:image/png;base64,${option?.profile_img}` || ''}>
                          {!option.profile_img && option.first_name.charAt(0)}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={option.first_name} />
                  </Box>
                ))}
              </Box>
            )} */}

        {showAutocomplete && (
          <Autocomplete
            open={showAutocomplete}
            onClose={() => setShowAutocomplete(false)}
            options={filteredUsers}
            getOptionLabel={(option) => option.first_name}
            onChange={handleUserSelect}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option.id}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemAvatar>
                  <Avatar src={option.avatar || ""}>
                    {!option.avatar && option.first_name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={option.first_name} />
              </Box>
            )}
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

export default Example;

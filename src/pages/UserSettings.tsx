import {
  Avatar,
  Badge,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { UserProps } from "../types/user";
import { EmojiStyle } from "emoji-picker-react";
import { useState } from "react";
import styled from "@emotion/styled";
import {
  AddAPhoto,
  AddPhotoAlternate,
  ArrowBackIosNew,
  Logout,
  Photo,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const UserSettings = ({ user, setUser }: UserProps) => {
  const n = useNavigate();
  const [name, setName] = useState("");
  const emojiStyles = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    // { label: "Native", style: EmojiStyle.NATIVE },
    { label: "Google", style: EmojiStyle.GOOGLE },
  ];
  const handleEmojiStyleChange = (event: any) => {
    const selectedEmojiStyle = event.target.value;
    setUser({ ...user, emojisStyle: selectedEmojiStyle });
  };

  const handleSaveName = () => {
    setUser({ ...user, name: name });
    setName("");
  };

  return (
    <>
      <BackBtn onClick={() => n("/")}>
        <ArrowBackIosNew /> &nbsp; Back
      </BackBtn>
      <Header>User Profile</Header>
      <Container>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Avatar
              sx={{
                background: "#9c9c9c81",
                backdropFilter: "blur(6px)",
                cursor: "pointer",
              }}
            >
              <AddAPhoto />
            </Avatar>
          }
        >
          <Avatar
            sx={{
              width: "96px",
              height: "96px",
              cursor: "pointer",
            }}
          />
        </Badge>
        <UserName>{user.name || "User"}</UserName>
        <CreatedAtDate>
          Registered since {new Date(user.createdAt).toLocaleDateString()}
        </CreatedAtDate>
        <FormControl>
          <FormHelperText>Emoji Style</FormHelperText>
          <Select
            value={user.emojisStyle}
            onChange={handleEmojiStyleChange}
            sx={{ width: "250px", borderRadius: "18px", color: "black" }}
          >
            {emojiStyles.map((style) => (
              <MenuItem key={style.style} value={style.style}>
                {style.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <StyledInput
          label={user.name === null ? "Add Name" : "Change Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {name !== "" && name !== user.name && (
          <SaveBtn onClick={handleSaveName}>Save name</SaveBtn>
        )}
        <Button
          color="error"
          variant="outlined"
          sx={{ padding: "8px 20px", borderRadius: "14px" }}
        >
          <Logout />
          &nbsp; Logout
        </Button>
      </Container>
    </>
  );
};

const Container = styled.div`
  margin: 0 auto;
  margin-top: 60px;
  max-width: 400px;
  padding: 85px 10px;
  border-radius: 50px;
  box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.25);
  background: #f5f5f5;
  color: black;
  border: 4px solid #b624ff;
  box-shadow: 0 0 18px 0 #b624ffbf;
  display: flex;
  gap: 14px;
  flex-direction: column;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.h2`
  font-size: 28px;
  margin-bottom: 64px;
  text-align: center;
`;

const BackBtn = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding: 8px 12px;
  background-color: transparent;
  color: #efefef;
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;
const StyledInput = styled(TextField)`
  & .MuiInputBase-root {
    border-radius: 16px;
    width: 250px;
  }
`;
const SaveBtn = styled.button`
  width: 250px;
  border: none;
  background: #b624ff;
  color: white;
  font-size: 18px;
  padding: 14px;
  border-radius: 16px;
  cursor: pointer;
`;

const UserName = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

const CreatedAtDate = styled.span`
  font-style: italic;
  opacity: 0.8;
`;

import React, { useEffect, useRef } from "react";
import {
  Box,
  Container,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import SendIcon from "@mui/icons-material/Send";
import NoteItem from "./NoteItem";

export default function ChatArea({
  notes,
  isProcessing,
  inputText,
  setInputText,
  isRecording,
  onMicClick,
  onSendText,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes, isProcessing]);

  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{ flexGrow: 1, overflowY: "auto", px: 2, pt: 2, pb: 12 }}
      >
        {notes.map((note) => (
          <NoteItem key={note.$id} note={note} />
        ))}
        {isProcessing && (
          <CircularProgress
            size={30}
            sx={{ alignSelf: "center", mt: 2, color: "#FFC400" }}
          />
        )}
        <div ref={bottomRef} />
      </Container>

      <Box
        sx={{
          p: 1.5,
          bgcolor: "#121212",
          borderTop: "1px solid #333",
          display: "flex",
          gap: 1,
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isRecording ? "..." : "بنویسید..."}
          disabled={isRecording}
          sx={{
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 28,
              bgcolor: "grey.800",
              color: "white",
            },
          }}
        />
        {inputText.length > 0 ? (
          <IconButton
            onClick={onSendText}
            sx={{ bgcolor: "#FFC400", color: "black", width: 50, height: 50 }}
          >
            <SendIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        ) : (
          <IconButton
            onClick={onMicClick}
            sx={{
              bgcolor: isRecording ? "#d32f2f" : "#FFC400",
              color: "black",
              width: 50,
              height: 50,
            }}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </IconButton>
        )}
      </Box>
    </>
  );
}

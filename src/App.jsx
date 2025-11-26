import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

// Logic Imports
import { functions, databases, APPWRITE_CONFIG } from "./appwrite";
import { ID, Query } from "appwrite";
import { blobToBase64 } from "./utils";
import { exportToWord } from "./utils/exportHelper";
import { useAudioRecorder } from "./hooks/useAudioRecorder";

// Component Imports
import HistoryAccordion from "./components/HistoryAccordion";
import MainHeader from "./components/MainHeader";
import ChatArea from "./components/ChatArea";
import EditorArea from "./components/EditorArea";
import TabPanel from "./components/TabPanel";

function App() {
  // --- STATE ---
  const [motherNote, setMotherNote] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const [isTitleSaved, setIsTitleSaved] = useState(false);
  const [notes, setNotes] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  // History
  const [historyList, setHistoryList] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  // Editor
  const [editorContent, setEditorContent] = useState("");

  // Chat Input
  const [inputText, setInputText] = useState("");
  const [isChatProcessing, setIsChatProcessing] = useState(false);

  // AI Edit State
  const [isEditingRecording, setIsEditingRecording] = useState(false);
  const [isEditingProcessing, setIsEditingProcessing] = useState(false);

  // --- HOOKS ---
  const chatRecorder = useAudioRecorder();
  const editRecorder = useAudioRecorder();

  // --- LOGIC: History ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTION_ID_MOTHER,
          [Query.orderDesc("$createdAt")]
        );
        setHistoryList(response.documents);
      } catch (e) {
        console.error(e);
      }
    };
    fetchHistory();
  }, [historyRefreshTrigger]);

  const triggerHistoryRefresh = () => setHistoryRefreshTrigger((v) => v + 1);

  const handleSelectHistoryItem = (item) => {
    setMotherNote(item);
    setTitleInput(item.title);
    setIsTitleSaved(true);
    setEditorContent(item.content || "");
    setTabIndex(0);
    setIsHistoryOpen(false);
  };

  const handleDeleteHistoryItem = async (e, id) => {
    e.stopPropagation();
    if (!confirm("آیا حذف شود؟")) return;
    await databases.deleteDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ID_MOTHER,
      id
    );
    triggerHistoryRefresh();
    if (motherNote && motherNote.$id === id) handleNewSession();
  };

  // --- LOGIC: Session Loading ---
  useEffect(() => {
    if (!motherNote) return;

    const loadSegments = async () => {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTION_ID_NOTES,
          [
            Query.equal("motherNoteId", motherNote.$id),
            Query.orderAsc("$createdAt"),
          ]
        );
        setNotes(res.documents);
      } catch (e) {
        console.error(e);
      }
    };

    loadSegments();
  }, [motherNote]);

  const handleCreateMotherNote = async () => {
    if (!titleInput.trim()) return alert("عنوان الزامی است");
    try {
      const res = await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ID_MOTHER,
        ID.unique(),
        { title: titleInput, content: "" }
      );
      setMotherNote(res);
      setEditorContent("");
      setIsTitleSaved(true);
      triggerHistoryRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewSession = () => {
    setMotherNote(null);
    setNotes([]);
    setTitleInput("");
    setIsTitleSaved(false);
    setTabIndex(0);
    setEditorContent("");
  };

  // --- LOGIC: Chat & Saving ---
  const saveSegmentToDb = async (text, typeTitle) => {
    if (!motherNote) return;
    try {
      const noteRes = await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ID_NOTES,
        ID.unique(),
        { text, title: typeTitle, motherNoteId: motherNote.$id }
      );
      setNotes((prev) => [...prev, noteRes]);

      const newContent = editorContent ? editorContent + "\n\n" + text : text;
      const motherRes = await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ID_MOTHER,
        motherNote.$id,
        { content: newContent }
      );
      setMotherNote(motherRes);
      setEditorContent(newContent);
    } catch (e) {
      console.error(e);
    }
  };

  // --- FIX 1: Chat Voice Logic uses FUNCTION_ID_TRANSCRIPTION ---
  const handleChatVoice = async () => {
    if (chatRecorder.isRecording) {
      setIsChatProcessing(true);
      const { audioBlob } = await chatRecorder.stopRecording();
      if (audioBlob) {
        try {
          const base64Audio = await blobToBase64(audioBlob);
          const execution = await functions.createExecution(
            // 👇 UPDATED HERE: Uses correct ID from config
            APPWRITE_CONFIG.FUNCTION_ID_TRANSCRIPTION,
            JSON.stringify({ audio: base64Audio, mimeType: audioBlob.type }),
            false,
            "/",
            "POST",
            { "Content-Type": "application/json" }
          );
          const response = JSON.parse(execution.responseBody);
          if (response.success)
            await saveSegmentToDb(response.message, "یادداشت صوتی");
        } catch (e) {
          console.error(e);
        }
      }
      setIsChatProcessing(false);
    } else {
      chatRecorder.startRecording();
    }
  };

  // --- FIX 2: Magic Editor Logic uses FUNCTION_ID_EDIT ---
  const handleVoiceEdit = async () => {
    if (!motherNote) return alert("لطفا ابتدا یک یادداشت ایجاد کنید.");

    if (editRecorder.isRecording) {
      setIsEditingRecording(false);
      setIsEditingProcessing(true);

      const { audioBlob } = await editRecorder.stopRecording();
      if (audioBlob) {
        try {
          const base64Audio = await blobToBase64(audioBlob);

          const execution = await functions.createExecution(
            // 👇 UPDATED HERE: Uses correct ID from config
            APPWRITE_CONFIG.FUNCTION_ID_EDIT,
            JSON.stringify({
              audio: base64Audio,
              mimeType: audioBlob.type,
              currentText: editorContent,
              noteId: motherNote.$id,
            }),
            false,
            "/",
            "POST",
            { "Content-Type": "application/json" }
          );

          const response = JSON.parse(execution.responseBody);

          if (response.success) {
            setEditorContent(response.newContent);
            setMotherNote((prev) => ({
              ...prev,
              content: response.newContent,
            }));
          } else {
            alert("خطا در ویرایش: " + (response.error || "Unknown"));
          }
        } catch (e) {
          console.error(e);
          alert("خطا در ارتباط با سرور");
        }
      }
      setIsEditingProcessing(false);
    } else {
      editRecorder.startRecording();
      setIsEditingRecording(true);
    }
  };

  // --- LOGIC: Editor Actions ---
  const handleSync = async () => {
    if (!motherNote) return;
    try {
      const res = await databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ID_MOTHER,
        motherNote.$id
      );
      setEditorContent(res.content);
      setMotherNote(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveEditor = async () => {
    if (!motherNote) return;
    await databases.updateDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ID_MOTHER,
      motherNote.$id,
      { content: editorContent }
    );
  };

  // --- RENDER ---
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        bgcolor: "#121212",
      }}
    >
      <HistoryAccordion
        historyList={historyList}
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistoryItem}
        onLoadRequest={triggerHistoryRefresh}
      />

      <MainHeader
        title={titleInput}
        setTitle={setTitleInput}
        isSaved={isTitleSaved}
        onSave={handleCreateMotherNote}
        onNewSession={handleNewSession}
        onEnableEdit={() => setIsTitleSaved(false)}
        hasMotherNote={!!motherNote}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />

      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {!motherNote ? (
          <Container
            maxWidth={false}
            sx={{ mt: 5, textAlign: "center", opacity: 0.7 }}
          >
            <NoteAddIcon sx={{ fontSize: 80, mb: 2, color: "#333" }} />
            <Typography variant="h5">یک یادداشت جدید شروع کنید</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              یا از لیست تاریخچه (بالا) انتخاب کنید
            </Typography>
          </Container>
        ) : (
          <>
            <TabPanel value={tabIndex} index={0}>
              <ChatArea
                notes={notes}
                isProcessing={isChatProcessing}
                inputText={inputText}
                setInputText={setInputText}
                isRecording={chatRecorder.isRecording}
                onMicClick={handleChatVoice}
                onSendText={() => {
                  if (inputText.trim()) {
                    saveSegmentToDb(inputText, "یادداشت متنی");
                    setInputText("");
                  }
                }}
              />
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
              <EditorArea
                content={editorContent}
                setContent={setEditorContent}
                onSync={handleSync}
                onSave={handleSaveEditor}
                onExport={() => exportToWord(motherNote.title, editorContent)}
                onVoiceEdit={handleVoiceEdit}
                isEditingRecording={isEditingRecording}
                isEditingProcessing={isEditingProcessing}
              />
            </TabPanel>
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;

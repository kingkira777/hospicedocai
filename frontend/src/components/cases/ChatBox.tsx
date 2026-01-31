import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  Avatar, 
  Container,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import api from '../../utils/axios';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  isHtml?: boolean; // New optional flag
}

type Props = {
    patientId: any
}

const ChatBox = ({ patientId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 0, 
      text: `
        <div style="font-family: sans-serif;">
          <h3 style="margin-top: 0; color: #1976d2;">Welcome!</h3>
          <p>I am your <strong>AI Medical Assistant</strong>. How can I help you today?</p>
        </div>
      `, 
      sender: 'ai',
      isHtml: true 
    }
  ]);
  const [conId, setConId] = useState('');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);


  
    const FetchAnalyzeDocumentsByAI = async() => {
        try {
            setIsTyping(true);
            const { data } = await api.post(`/cases/analyze-medical-paper/${patientId}`);
            const { convId } = data;
            const { analysis_results } = data.finalResults;
            console.log("convId", convId);
            console.log("analysis_results", analysis_results);

            setConId(convId);
            let text = '';
            for (const result of analysis_results ) {

                if(result.non_rn_notes !== ''){
                    text += `
                        <div style="font-family: sans-serif;">
                            <h3 style="margin-top: 0; color: #1976d2;">${result.file_name}</h3>
                            <p><b>Summary</b>:  ${result.non_rn_notes}</p>
                        </div>
                    `;
                }else{
                    

                    const htmlTemplate = `
                        <div style="font-family: sans-serif;">
                            <h3 style="margin-top: 0; color: #1976d2;">${result.file_name}</h3>
                            <p><b>Summary:</b> 
                                <ul>
                                    <li>Documented: ${result.summary.is_documented? 'Yes' : 'No'}</li>
                                    <li>Visit Date: ${result.summary.visit_date}</li>
                                    <li>Clinician Signature Present: ${result.summary.clinician_signature_present? 'Yes' : 'No'}</li>
                                </ul>
                            </p>
                            <p><b>Physical Assessment:</b>
                                <ul>
                                    <li>Vitals: ${result.physical_assessment.vitals}</li>
                                    <li>Cardiac Findings: ${result.physical_assessment.cardiac_findings}</li>
                                    <li>Skin/Wound Notes: ${result.physical_assessment.skin_wound_notes}</li>
                                </ul>
                            </p>
                            <p><b>Indicators of Decline:</b> 
                                <ol>
                                    ${result.indicators_of_decline.map((item: any) => `<li>${item}</li>`).join('')}
                                </ol>
                            </p>
                            <p><b>Suggested Care Plan Updates:</b> 
                                <ol>
                                    ${result.suggested_care_plan_updates.map((item: any) => `<li>${item}</li>`).join('')}
                                </ol>
                            </p>
                            <p><b>Hallucination Check:</b> ${result.hallucination_check}</p>
                            <p><b>Narrative:</b> ${result.narrative}</p>
                            <p><b>Missing:</b> ${result.missing}</p>
                            <p><b>Strengthen the Case:</b> ${result.strengthen_the_case}</p>
                        </div>
                    `;
                    text += htmlTemplate;

                }
            }
            const userMessage: Message = { id: Date.now(), text, sender: 'ai', isHtml: true };
            setMessages((prev) => [...prev, userMessage]);
            setIsTyping(false);
        } catch (error) {
            
        }
    };


    useEffect(() => {
        console.log('Patient ID:', patientId);
        if(patientId){
            FetchAnalyzeDocumentsByAI();
        }
    }, [patientId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    setIsTyping(true);

    // Send user message
    const { data } = await api.post(`/cases/follow-up-question`, {
      convId: conId,
      question: input
    });
    const aiResponse: Message = { 
        id: Date.now() + 1, 
        text: data.response, 
        sender: 'ai' 
    };
    setMessages((prev) => [...prev, aiResponse]);
    
    setIsTyping(false);
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={2} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 2 }}>
        
        {/* Header */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">AI Medical Assistant</Typography>
        </Box>

        {/* Message List */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
          <List>
            {messages.map((msg) => (
              <ListItem 
                key={msg.id} 
                sx={{ 
                  flexDirection: 'column', 
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1 
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: msg.sender === 'user' ? 'secondary.main' : 'primary.main' }}>
                    {msg.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                  </Avatar>
                  <Paper sx={{ p: 2, borderRadius: 2, maxWidth: '100%' }}>
                    {msg.isHtml ? (
                      /* Render HTML safely */
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    ) : (
                      /* Render plain text */
                      <Typography variant="body2">{msg.text}</Typography>
                    )}
                  </Paper>
                </Box>
              </ListItem>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <ListItem sx={{ alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: '#4caf50', width: 35, height: 35 }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Paper sx={{ p: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} thickness={5} />
                    <Typography variant="caption" color="textSecondary">AI is analyzing the notes...</Typography>
                  </Paper>
                </Box>
              </ListItem>
            )}

            <div ref={scrollRef} />
          </List>
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />

          {
            (patientId !== undefined && !isTyping) && 
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
              <SendIcon />
            </IconButton>

          }
          
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatBox;


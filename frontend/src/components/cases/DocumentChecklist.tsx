import { PageContainer } from "@toolpad/core";
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper,
  Chip, Stack, styled
} from '@mui/material';
import {
    CheckCircle,
  CheckCircleOutlineOutlined,
  RadioButtonUncheckedOutlined
} from '@mui/icons-material';

import { DOCUMENT_CHECKLIST } from "../../constant/documents";


const SidebarCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
}));

const StatusDot = styled(Box)<{ color: string }>(({ color }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  display: 'inline-block',
  marginRight: 8,
}));

const DocumentChecklist = ({ documents }: any) => {
    
    useEffect(() => {
        console.log("Documents:", documents);
    }, [documents]);

    return (
        <SidebarCard>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">DOCUMENTATION CHECKLIST</Typography>

                {
                    (documents.length <= 8) && <Chip label="DOCS NEED WORK" color="error" variant="outlined" size="small" sx={{ color: 'red', borderColor: 'red' }} />
                }
                {
                    (documents.length > 8 && documents.length <= 12) && <Chip label="DOCS GOOD" color="warning" variant="outlined" size="small" sx={{ color: 'orange', borderColor: 'orange' }} />
                }
                
                {
                    (documents.length > 12) && <Chip label="DOCS GOOD" color="success" variant="outlined" size="small" sx={{ color: 'green', borderColor: 'green' }} />
                }
                
            </Stack>
            
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Complete ({documents.length})</Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
                {DOCUMENT_CHECKLIST.map(item => (
                <Stack key={item} direction="row" spacing={1} alignItems="center">
                    {
                        (documents.filter((x: any) => x.name === item).length > 0) ? <CheckCircle color="success" sx={{ fontSize: 18 }} /> : <RadioButtonUncheckedOutlined color="error" sx={{ fontSize: 18 }} />
                    }
                    <Typography variant="body2">{item}</Typography>
                </Stack>
                ))}
            </Stack>
        </SidebarCard>
    )
}

export default DocumentChecklist


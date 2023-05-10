import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Dialog, IconButton, TextField, Tooltip } from '@mui/material';

interface IDialogDetailProps {
  content: string;
  onClose: () => void;
  open: boolean;
  title?: string;
  multiline: boolean;
  copyOnClick: boolean;
}

const DialogDetail: React.FC<IDialogDetailProps> = props => {
  const { content, onClose, open, title, multiline, copyOnClick } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        px={2}
        py={4}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={2}
      >
        <TextField
          disabled
          fullWidth
          multiline={multiline}
          defaultValue={content}
          sx={{
            width: 380,
          }}
        />
        {copyOnClick && (
          <Tooltip title="Click to copy" placement="top">
            <IconButton
              size="medium"
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(content);
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Dialog>
  );
};

export default DialogDetail;

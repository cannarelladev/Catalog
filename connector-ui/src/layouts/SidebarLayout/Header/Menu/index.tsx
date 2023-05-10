import {
  Alert,
  AlertTitle,
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { SessionContext } from 'src/contexts/SessionContext';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { systemError, setSystemError, systemMessage, setSystemMessage } =
    useContext(SessionContext);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  return (
    <>
      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'inline-flex',
          },
          alignItems: 'center',
          justifyContent: 'start',
          width: '100%',
          gap: 2,
        }}
      >
        {systemError && (
          <Alert
            onClose={() => setSystemError('')}
            severity="error"
            sx={{
              width: '100%',
            }}
          >
            <AlertTitle>{systemError}</AlertTitle>
          </Alert>
        )}
        {systemMessage && (
          <Alert onClose={() => setSystemMessage('')} severity="success">
            <AlertTitle>{systemMessage}</AlertTitle>
          </Alert>
        )}
      </Box>
      <Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
        {/* <MenuItem sx={{ px: 3 }} component={NavLink} to="/overview">
          Overview
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/tabs">
          Tabs
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/cards">
          Cards
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/modals">
          Modals
        </MenuItem> */}
      </Menu>
    </>
  );
}

export default HeaderMenu;

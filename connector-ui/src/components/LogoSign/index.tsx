import {
  Box,
  Tooltip,
  Badge,
  TooltipProps,
  tooltipClasses,
  styled,
  useTheme,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-liqo-blue.png';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        display: flex;
        align-items: center;
        text-decoration: none;
        padding: ${theme.spacing(0, 0, 0, 1)};
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
`
);

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100],
  },
}));

function Logo() {
  const theme = useTheme();

  return (
    <TooltipWrapper title="Liqo Dashboard" arrow>
      <LogoWrapper to="/overview">
        <Badge
          sx={{
            '.MuiBadge-badge': {
              fontSize: theme.typography.pxToRem(11),
              right: -4,
              top: 12,
            },
          }}
          overlap="circular"
          color="success"
          badgeContent="BETA"
        >
          <LogoSignWrapper>
            <img src={logo} alt="Liqo" />
          </LogoSignWrapper>
        </Badge>
        <Typography sx={{
          fontWeight: 700,
          fontSize: theme.typography.pxToRem(18),
          paddingTop: theme.spacing(2),
          marginLeft: theme.spacing(2),
        }}>Dashboard</Typography>
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;

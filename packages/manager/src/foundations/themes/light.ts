import {
  Colors,
  // Components,
} from '@linode/design-language-system/cloudmanager';
import { ThemeOptions } from '@mui/material/styles';

import { breakpoints } from 'src/foundations/breakpoints';
import { latoWeb } from 'src/foundations/fonts';

export const bg = {
  app: Colors.Neutrals.Grey02,
  bgAccessRow: Colors.Neutrals.Grey01,
  bgAccessRowTransparentGradient: 'rgb(255, 255, 255, .001)',
  bgPaper: Colors.Neutrals.White,
  lightBlue1: Colors.Brand01,
  lightBlue2: Colors.Brand02,
  main: Colors.Neutrals.Grey02,
  mainContentBanner: Colors.Neutrals.Grey10,
  offWhite: Colors.Neutrals.Grey01,
  primaryNavPaper: Colors.Neutrals.Grey10,
  tableHeader: Colors.Neutrals.Grey01,
  white: Colors.Neutrals.White,
} as const;

const primaryColors = {
  dark: Colors.Brand05,
  divider: Colors.Neutrals.Grey02,
  headline: Colors.Neutrals.Grey10,
  light: Colors.Brand03,
  main: Colors.Brand04,
  text: Colors.Neutrals.Grey08,
  white: Colors.Neutrals.White,
};

export const color = {
  black: Colors.Neutrals.Black,
  blue: Colors.Brand04,
  blueDTwhite: Colors.Brand04,
  border2: Colors.Neutrals.Grey05,
  border3: Colors.Neutrals.Grey03,
  boxShadow: Colors.Neutrals.Grey04,
  boxShadowDark: Colors.Neutrals.Grey06,
  disabledText: Colors.Neutrals.Grey05,
  drawerBackdrop: 'rgba(255, 255, 255, 0.5)',
  green: Colors.Status.Success,
  grey1: Colors.Neutrals.Grey06,
  grey2: Colors.Neutrals.Grey04,
  grey3: Colors.Neutrals.Grey05,
  grey4: Colors.Neutrals.Grey07,
  grey5: Colors.Neutrals.Grey02,
  grey6: Colors.Neutrals.Grey04,
  grey7: Colors.Neutrals.Grey03,
  grey8: Colors.Neutrals.Grey04,
  grey9: Colors.Neutrals.Grey02,
  headline: primaryColors.headline,
  label: Colors.Neutrals.Grey08,
  offBlack: Colors.Neutrals.Grey09,
  orange: Colors.Status.Warning,
  red: Colors.Status.Danger,
  tableHeaderText: 'rgba(0, 0, 0, 0.54)',
  tagButton: Colors.Brand01,
  tagIcon: Colors.Brand03,
  teal: Colors.Status.Success,
  white: Colors.Neutrals.White,
  yellow: Colors.Status.Highlight,
} as const;

export const textColors = {
  headlineStatic: Colors.Neutrals.Grey10,
  linkActiveLight: Colors.Brand04,
  tableHeader: Colors.Neutrals.Grey07,
  tableStatic: Colors.Neutrals.Grey08,
  textAccessTable: Colors.Neutrals.Grey08,
} as const;

export const borderColors = {
  borderTable: Colors.Neutrals.Grey02,
  borderTypography: Colors.Neutrals.Grey04,
  divider: Colors.Neutrals.Grey04,
} as const;

const iconCircleAnimation = {
  '& .circle': {
    fill: primaryColors.main,
    transition: 'fill .2s ease-in-out .2s',
  },
  '& .insidePath *': {
    stroke: 'white',
    transition: 'fill .2s ease-in-out .2s, stroke .2s ease-in-out .2s',
  },
  '& .outerCircle': {
    animation: '$dash 2s linear forwards',
    stroke: primaryColors.dark,
    strokeDasharray: 1000,
    strokeDashoffset: 1000,
  },
};

const iconCircleHoverEffect = {
  '& .circle': {
    fill: primaryColors.main,
  },
  '& .insidePath *': {
    stroke: 'white',
  },
};

// Used for styling html buttons to look like our generic links
const genericLinkStyle = {
  '&:hover': {
    backgroundColor: 'transparent',
    color: primaryColors.main,
    textDecoration: 'underline',
  },
  background: 'none',
  border: 'none',
  color: textColors.linkActiveLight,
  cursor: 'pointer',
  font: 'inherit',
  minWidth: 0,
  padding: 0,
};

// Used for styling status pills as seen on Linodes
const genericStatusPillStyle = {
  '&:before': {
    borderRadius: '50%',
    content: '""',
    display: 'inline-block',
    height: 16,
    marginRight: 8,
    minWidth: 16,
    width: 16,
  },
  backgroundColor: 'transparent',
  color: textColors.tableStatic,
  fontFamily: latoWeb.bold,
  fontSize: '1rem',
  padding: 0,
};

const genericTableHeaderStyle = {
  '&:hover': {
    '& span': {
      color: textColors.linkActiveLight,
    },
    cursor: 'pointer',
  },
};

const visuallyVisible = {
  clip: 'none',
  height: 'auto',
  overflow: 'initial',
  /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility */
  position: 'relative',
  width: 'auto',
};

const visuallyHidden = {
  clip: 'rect(1px, 1px, 1px, 1px)',
  height: 1,
  overflow: 'hidden',
  /* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility */
  position: 'absolute !important',
  width: 1,
};

const graphTransparency = '0.7';

const spacing = 8;

export const lightTheme: ThemeOptions = {
  addCircleHoverEffect: {
    ...iconCircleHoverEffect,
  },
  animateCircleIcon: {
    ...iconCircleAnimation,
  },
  applyLinkStyles: {
    ...genericLinkStyle,
  },
  applyStatusPillStyles: {
    ...genericStatusPillStyle,
  },
  applyTableHeaderStyles: {
    ...genericTableHeaderStyle,
  },
  bg,
  borderColors,
  breakpoints,
  color,
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          '& .actionPanel': {
            paddingBottom: 12,
            paddingLeft: 16,
          },
          flexBasis: '100%',
          width: '100%',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          padding: 16,
          paddingTop: 0,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        },
        root: {
          '& h3': {
            transition: 'color 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          },
          '& svg': {
            fill: '#2575d0',
            stroke: '#2575d0',
          },
          '&.Mui-expanded': {
            '& .caret': {
              transform: 'rotate(0deg)',
            },
            margin: 0,
            minHeight: 48,
          },
          '&:hover': {
            '& h3': {
              color: primaryColors.light,
            },
          },
          backgroundColor: 'transparent',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: 'inherit',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        endAdornment: {
          '.MuiAutocomplete-clearIndicator': {
            visibility: 'visible !important',
          },
          '.MuiAutocomplete-popupIndicator': {
            svg: {
              ':hover': {
                opacity: 1,
              },
              fontSize: '28px',
              opacity: 0.5,
            },
          },
          paddingRight: 4,
          svg: {
            color: '#aaa',
          },
          top: 'unset',
        },
        hasPopupIcon: {
          '&.MuiAutocomplete-root': {
            '& .MuiAutocomplete-inputRoot': {
              paddingRight: '34px',
            },
          },
        },
        inputRoot: {
          paddingLeft: 8,
        },
        listbox: {
          backgroundColor: bg.white,
          border: `1px solid ${primaryColors.main}`,
          padding: '4px',
        },
        loading: {
          border: `1px solid ${primaryColors.main}`,
        },
        noOptions: {
          border: `1px solid ${primaryColors.main}`,
        },
        option: {
          '&.Mui-focused, :hover': {
            backgroundColor: `${primaryColors.main} !important`,
            color: primaryColors.white,
            transition: 'background-color 0.2s',
          },
          fontSize: '0.9rem',
          padding: '10px !important',
        },
        popper: {
          // To remove the double border of listbox and input
          '&.MuiAutocomplete-popper': {
            '&[data-popper-placement="bottom"]': {
              '.MuiAutocomplete-listbox': {
                borderTop: 0,
              },
            },
            '&[data-popper-placement="top"]': {
              '.MuiAutocomplete-listbox': {
                borderBottom: 0,
              },
            },
          },
        },
        tag: {
          '&:not(.MuiChip-root)': {
            borderRadius: '4px',
            padding: '4px',
          },
          '.MuiChip-deleteIcon': {
            ':hover': {
              backgroundColor: primaryColors.main,
              color: primaryColors.white,
            },
            borderRadius: '50%',
            color: primaryColors.text,
            fontSize: '16px',
            margin: '0 4px',
          },

          backgroundColor: bg.lightBlue1,
          padding: '12px 2px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: 'unset',
          color: '#c9c7c7',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        invisible: {
          backgroundColor: 'transparent',
        },
        root: {
          backgroundColor: color.drawerBackdrop,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          // TODO: We can remove this after migration since we can define variants
          '&.loading': {
            backgroundColor: primaryColors.text,
          },
          '&:active': {
            backgroundColor: primaryColors.dark,
          },
          '&:disabled': {
            color: 'white',
          },
          '&:hover, &:focus': {
            backgroundColor: '#226dc3',
          },
          backgroundColor: primaryColors.main,
          color: '#fff',
          padding: '2px 20px',
        },
        containedSecondary: {
          // TODO: We can remove this after migration since we can define variants
          '&.loading': {
            color: primaryColors.text,
          },
          '&:active': {
            backgroundColor: 'transparent',
            borderColor: primaryColors.dark,
            color: primaryColors.dark,
          },
          '&:disabled': {
            backgroundColor: 'transparent',
            borderColor: '#c9cacb',
            color: '#c9cacb',
          },
          '&:hover, &:focus': {
            backgroundColor: 'transparent',
            color: textColors.linkActiveLight,
          },
          backgroundColor: 'transparent',
          color: textColors.linkActiveLight,
        },
        outlined: {
          '&:hover, &:focus': {
            backgroundColor: '#f5f8ff',
            border: '1px solid #d7dfed',
            color: '#2575d0',
          },
          backgroundColor: 'transparent',
          border: `1px solid ${primaryColors.main}`,
          color: textColors.linkActiveLight,
          minHeight: 34,
        },
        root: {
          border: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          fontFamily: latoWeb.bold,
          fontSize: '1rem',
          lineHeight: 1,
          minHeight: 34,
          minWidth: 105,
          textTransform: 'capitalize',
          transition: 'none',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        content: {
          // This is necessary for text to ellipsis responsively without the need for a hard set width value that won't play well with flexbox.
          minWidth: 0,
        },
        root: {
          backgroundColor: '#fbfbfb',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#ccc',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        clickable: {
          '&:focus': {
            backgroundColor: '#cce2ff',
          },
          '&:hover': {
            backgroundColor: '#cce2ff',
          },
          backgroundColor: '#e5f1ff',
        },
        deleteIcon: {
          color: primaryColors.text,
          margin: 0,
          padding: 2,
        },
        label: {
          alignItems: 'center',
          display: 'flex',
          height: 'inherit',
          justifyContent: 'center',
          paddingLeft: 4,
          paddingRight: 4,
          width: '100%',
        },
        labelSmall: {
          paddingLeft: 4,
          paddingRight: 4,
        },
        outlined: {
          backgroundColor: 'transparent',
          borderRadius: 1,
        },
        root: {
          '&:focus': {
            outline: '1px dotted #999',
          },
          '&:last-child': {
            marginRight: 0,
          },
          alignItems: 'center',
          backgroundColor: '#E7E7E7',
          borderRadius: 4,
          color: primaryColors.text,
          display: 'inline-flex',
          fontSize: '.8rem',
          height: 20,
          marginBottom: 2,
          marginRight: 4,
          marginTop: 2,
          paddingLeft: 2,
          paddingRight: 2,
        },
        sizeSmall: {
          fontSize: '.65rem',
          height: 20,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        circle: {
          strokeLinecap: 'inherit',
        },
      },
    },
    MuiCollapse: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: '0 0 5px #bbb',
          [breakpoints.down('sm')]: {
            margin: 24,
            maxHeight: 'calc(100% - 48px)',
            maxWidth: '100% !important',
          },
        },
        paperScrollPaper: {
          maxHeight: 'calc(100% - 48px)',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '& .actionPanel': {
            padding: 0,
          },
          justifyContent: 'flex-start',
          margin: 0,
          padding: 24,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '& h2': {
            lineHeight: 1.2,
          },
          borderBottom: '1px solid #eee',
          color: primaryColors.headline,
          marginBottom: 20,
          padding: '16px 24px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.12)',
          marginBottom: spacing,
          marginTop: spacing,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: '0 0 5px #bbb',
          /** @todo This is breaking typing. */
          // overflowY: 'overlay',
          display: 'block',
          fallbacks: {
            overflowY: 'auto',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '&.copy > div': {
            backgroundColor: '#f4f4f4',
          },
          [breakpoints.down('xs')]: {
            width: '100%',
          },
          marginTop: 16,
          minWidth: 120,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: primaryColors.text,
        },
        root: {
          marginLeft: -11,
        },
      },
    },
    MuiFormGroup: {
      styleOverrides: {
        root: {
          '&[role="radiogroup"]': {
            marginBottom: 16,
            marginTop: 8,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          '&$error': {
            color: '#ca0813',
          },
          fontSize: '0.875rem',
          lineHeight: 1.25,
          maxWidth: 415,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&$disabled': {
            color: '#555',
            opacity: 0.5,
          },
          '&$error': {
            color: '#555',
          },
          '&.Mui-focused': {
            color: '#555',
          },
          color: '#555',
          fontFamily: latoWeb.bold,
          fontSize: '.875rem',
          marginBottom: 8,
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'large',
      },
      styleOverrides: {
        edgeEnd: {
          marginRight: 0,
        },
        root: {
          '&:hover': {
            backgroundColor: 'transparent',
            color: primaryColors.main,
          },
        },
      },
    },
    MuiInput: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: {
        disabled: {},
        error: {},
        focused: {},
        formControl: {
          'label + &': {
            marginTop: 0,
          },
        },
        input: {
          boxSizing: 'border-box',
          [breakpoints.only('xs')]: {
            fontSize: '1rem',
          },
          fontSize: '0.9rem',
          padding: 8,
        },
        inputMultiline: {
          lineHeight: 1.4,
          minHeight: 125,
          padding: '9px 12px',
        },
        root: {
          '& svg': {
            '&:hover': {
              color: '#5e9aea',
            },
            color: primaryColors.main,
            fontSize: 18,
          },
          '&$disabled': {
            borderColor: '#ccc',
            color: 'rgba(0, 0, 0, 0.75)',
            opacity: 0.5,
          },
          '&.Mui-error': {
            borderColor: '#ca0813',
          },
          '&.Mui-focused': {
            '& .select-option-icon': {
              paddingLeft: `30px !important`,
            },
            borderColor: primaryColors.main,
            boxShadow: '0 0 2px 1px #e1edfa',
          },
          '&.affirmative': {
            borderColor: '#00b159',
          },
          alignItems: 'center',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
          [breakpoints.down('xs')]: {
            maxWidth: '100%',
            width: '100%',
          },
          color: primaryColors.text,
          lineHeight: 1,
          maxWidth: 416,
          minHeight: 34,
          transition: 'border-color 225ms ease-in-out',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        positionEnd: {
          marginRight: 10,
        },
        root: {
          '& p': {
            [breakpoints.only('xs')]: {
              fontSize: '1rem',
            },
            color: '#606469',
            fontSize: '0.9rem',
          },
          [breakpoints.only('xs')]: {
            fontSize: '1rem',
          },
          color: '#606469',
          fontSize: '0.9rem',
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            opacity: 0.42,
          },
          height: 'auto',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        formControl: {
          position: 'relative',
        },
        shrink: {
          transform: 'none',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#b7d6f9',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        padding: {
          paddingBottom: 0,
          paddingTop: 0,
        },
        root: {
          '&.reset': {
            '& li': {
              display: 'list-item',
              listStyleType: 'initial',
              padding: 0,
            },
            listStyle: 'initial',
            margin: 'inherit',
            padding: 'inherit',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        disabled: {},
        root: {
          '&$disabled': {
            opacity: 0.5,
          },
          '&$selected, &$selected:hover': {
            backgroundColor: 'transparent',
            color: primaryColors.main,
          },
          '&.selectHeader': {
            color: primaryColors.text,
            fontFamily: latoWeb.bold,
            fontSize: '1rem',
            opacity: 1,
          },
          color: primaryColors.text,
        },
        selected: {},
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          marginBottom: 0,
          marginTop: 0,
        },
        secondary: {
          lineHeight: '1.2em',
          marginTop: 4,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          '& .selectMenuList': {
            '& li': {
              paddingLeft: 10,
              paddingRight: 10,
            },
            boxSizing: 'content-box',
            [breakpoints.down('xs')]: {
              minWidth: 200,
            },
            maxHeight: 250,
            maxWidth: 200,
            overflowX: 'hidden',
            overflowY: 'auto',
            padding: 4,
          },
          '&.selectMenuDropdown': {
            border: `1px solid ${primaryColors.main}`,
            borderRadius: 0,
            boxShadow: 'none',
            boxSizing: 'content-box',
            margin: '0 0 0 -1px',
            outline: 0,
            position: 'absolute',
          },
          maxWidth: 350,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '& em': {
            fontStyle: 'normal !important',
          },
          '&$selected, &$selected:hover': {
            backgroundColor: 'transparent',
            color: primaryColors.main,
            opacity: 1,
          },
          '&:hover': {
            backgroundColor: primaryColors.main,
            color: 'white',
          },
          color: primaryColors.text,
          fontFamily: latoWeb.normal,
          fontSize: '.9rem',
          height: 'auto',
          minHeight: '38px',
          paddingBottom: 8,
          paddingTop: 8,
          textOverflow: 'initial',
          transition: `${'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)'}`,
          whiteSpace: 'initial',
        },
        selected: {},
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          border: '1px solid #e7e7e7',
        },
        root: {},
        rounded: {
          borderRadius: 0,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: '0 0 5px #ddd',
          [breakpoints.up('lg')]: {
            minWidth: 250,
          },
          minWidth: 200,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        checked: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
        colorSecondary: {
          '&$checked': {
            '&:hover': {
              backgroundColor: 'rgba(36, 83, 233, 0.04)',
            },
            color: primaryColors.main,
          },
          '&:hover': {
            backgroundColor: 'rgba(36, 83, 233, 0.04)',
          },
          color: primaryColors.main,
        },
        root: ({ theme }) => ({
          '& $checked': {
            color: primaryColors.main,
          },
          '& .defaultFill': {
            fill: theme.color.white,
            transition: theme.transitions.create(['fill']),
          },
          '&.Mui-disabled': {
            '& .defaultFill': {
              fill: '#f4f4f4',
            },
            color: '#ccc !important',
            fill: '#f4f4f4 !important',
            pointerEvents: 'none',
          },
          '&:hover': {
            '& .defaultFill': {
              fill: theme.color.white,
            },
            color: theme.palette.primary.main,
            fill: theme.color.white,
          },
          color: '#ccc',
          padding: '10px 10px',
          transition: theme.transitions.create(['color']),
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        disabled: {},
        icon: {
          color: '#aaa !important',
          height: 28,
          marginRight: 4,
          marginTop: -2,
          opacity: 0.5,
          transition: 'color 225ms ease-in-out',
          width: 28,
        },
        select: {
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        text: {
          borderRadius: 0,
          marginTop: 0,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {},
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          borderLeft: `6px solid transparent`,
          borderRadius: 4,
          boxShadow: '0 0 5px #ddd',
          color: '#606469',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 24,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        checked: {},
        disabled: {},
        root: {
          '& $checked': {
            '& .square': {
              fill: 'white',
            },
            // color: `${primaryColors.main} !important`,
            '& input': {
              left: -20,
            },
            '&$switchBase': {
              '& + $track': {
                opacity: 1,
              },
            },
          },
          '& $disabled': {
            '&$switchBase': {
              '& + $track': {
                backgroundColor: '#ddd',
                borderColor: '#ccc',
              },
              '& .square': {
                fill: 'white',
              },
            },
          },
          '& .icon': {
            borderRadius: 1,
            height: 16,
            left: 0,
            position: 'relative',
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            width: 16,
          },
          '& .square': {
            fill: 'white',
            transition: 'fill 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          },
          '&:hover, &:focus': {
            '& $checked': {
              '& + $track': {
                opacity: 1,
              },
            },
          },
          '.MuiSwitch-track': {
            opacity: '1 !important',
          },
          height: 48,
          width: 68,
        },
        switchBase: {
          '&$checked': {
            transform: 'translateX(20px)',
          },
          '&.Mui-disabled': {
            '& +.MuiSwitch-track': {
              backgroundColor: '#ddd',
              borderColor: '#ccc',
            },
          },
          color: primaryColors.main,
          padding: 16,
        },
        track: {
          backgroundColor: '#C9CACB',
          borderRadius: 1,
          boxSizing: 'content-box',
          height: 24,
          left: 12,
          marginLeft: 0,
          marginTop: 0,
          opacity: 1,
          top: 12,
          transition: 'border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          width: 44,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&$selected, &$selected:hover': {
            color: primaryColors.headline,
            fontFamily: latoWeb.bold,
          },
          '&:hover': {
            color: primaryColors.main,
          },
          alignItems: 'center',
          appearance: 'none',
          boxSizing: 'border-box',
          [breakpoints.up('md')]: {
            minWidth: 75,
          },
          color: 'rgba(0, 0, 0, 0.54)',
          display: 'inline-flex',
          flexShrink: 0,
          justifyContent: 'center',
          lineHeight: 1.3,
          margin: 1,
          maxWidth: '264',
          minHeight: 48,
          minWidth: 50,
          overflow: 'hidden',
          padding: '6px 16px',
          position: 'relative',
          textTransform: 'inherit',
          verticalAlign: 'middle',
        },
        selected: {},
        textColorPrimary: {
          '&$selected': {
            color: '#32363c',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'initial',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        body: {
          fontSize: '.9rem',
        },
        head: {
          fontSize: '.9rem',
          height: 46,
          lineHeight: 1.1,
        },
        root: {
          borderBottom: `1px solid ${primaryColors.divider}`,
          borderTop: `1px solid ${primaryColors.divider}`,
          padding: 10,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        head: {
          backgroundColor: '#fbfbfb',
          height: 'auto',
        },
        hover: {
          '& a': {
            color: primaryColors.text,
          },
          '& a.secondaryLink': {
            '&:hover': {
              textDecoration: 'underline',
            },
            color: primaryColors.main,
          },
          cursor: 'pointer',
        },
        root: {
          '&:hover, &:focus': {
            '&$hover': {
              backgroundColor: '#fbfbfb',
              [breakpoints.up('md')]: {
                boxShadow: `inset 5px 0 0 ${primaryColors.main}`,
              },
            },
          },
          backfaceVisibility: 'hidden',
          backgroundColor: primaryColors.white,
          height: 40,
          position: 'relative',
          zIndex: 1,
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        icon: {
          color: 'inherit !important',
          marginTop: 2,
          opacity: 1,
        },
        iconDirectionAsc: {
          transform: 'rotate(0deg)',
        },
        iconDirectionDesc: {
          transform: 'rotate(180deg)',
        },
        root: {
          '&.Mui-active': {
            color: textColors.tableHeader,
          },
          '&:focus': {
            outline: '1px dotted #999',
          },
          '&:hover': {
            color: primaryColors.main,
          },
          fontSize: '.9rem',
          lineHeight: '1.1rem',
          transition: 'color 225ms ease-in-out',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        fixed: {
          overflowX: 'auto',
        },
        indicator: {
          primary: {
            backgroundColor: primaryColors.main,
          },
          secondary: {
            backgroundColor: primaryColors.main,
          },
        },
        root: {
          '& $scrollButtons:first-of-type': {
            '& svg': {
              backgroundColor: 'rgba(232, 232, 232, .9)',
              borderRadius: '50%',
              height: 39,
              padding: '7px 4px',
              width: 38,
            },
            bottom: 6,
            left: 0,
            position: 'absolute',
            zIndex: 2,
          },
          '& $scrollButtons:last-child': {
            '& svg': {
              backgroundColor: 'rgba(232, 232, 232, .9)',
              borderRadius: '50%',
              height: 39,
              padding: '7px 4px',
              width: 38,
            },
          },
          boxShadow: 'inset 0 -1px 0 #c5c6c8',
          margin: '16px 0',
          minHeight: 48,
          position: 'relative',
        },
        scrollButtons: {
          flex: '0 0 40px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        popper: {
          opacity: 1,
        },
        tooltip: {
          backgroundColor: 'white',
          borderRadius: 0,
          boxShadow: '0 0 5px #bbb',
          [breakpoints.up('sm')]: {
            fontSize: '.9rem',
            padding: '8px 10px',
          },
          color: '#606469',
          maxWidth: 200,
          textAlign: 'left',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        button: {
          '&$colorSecondary': {
            '&:active': {
              backgroundColor: 'transparent',
              color: primaryColors.light,
            },
            '&:hover, &:focus': {
              backgroundColor: 'transparent !important',
              color: primaryColors.light,
            },
            backgroundColor: 'transparent',
            color: primaryColors.main,
          },
          '&:active': {
            backgroundColor: primaryColors.light,
          },
          '&:hover, &:focus': {
            backgroundColor: primaryColors.light,
          },
          backgroundColor: primaryColors.main,
          border: 'none',
          borderRadius: '3px',
          [breakpoints.down('sm')]: {
            marginLeft: 8,
            maxHeight: 34,
            minWidth: 100,
          },
          color: '#fff',
          cursor: 'pointer',
          fontFamily: latoWeb.bold,
          fontSize: '1rem',
          lineHeight: 1,
          maxHeight: 34,
          minHeight: `34px`,
          padding: `8px 20px`,
          position: 'relative',
          textTransform: 'inherit',
        },
      },
    },
  },
  font: {
    bold: latoWeb.bold,
    normal: latoWeb.normal,
    semiBold: latoWeb.semiBold,
  },
  graphs: {
    aborted: {
      clients: `rgba(214, 0, 0, ${graphTransparency})`,
      connections: `rgba(255, 10, 10, ${graphTransparency})`,
    },
    blue: `rgba(100, 173, 246, ${graphTransparency})`,
    connections: {
      accepted: `rgba(91, 105, 139, ${graphTransparency})`,
      handled: `rgba(50, 59, 77, ${graphTransparency})`,
    },
    cpu: {
      percent: `rgba(54, 131, 220, ${graphTransparency})`,
      system: `rgba(2, 118, 253, ${graphTransparency})`,
      user: `rgba(81, 166, 245, ${graphTransparency})`,
      wait: `rgba(145, 199, 237, ${graphTransparency})`,
    },
    diskIO: {
      read: `rgba(255, 196, 105, ${graphTransparency})`,
      swap: `rgba(238, 44, 44, ${graphTransparency})`,
      write: `rgba(255, 179, 77, ${graphTransparency})`,
    },
    green: `rgba(91, 215, 101, ${graphTransparency})`,
    inodes: `rgba(224, 138, 146, ${graphTransparency})`,
    load: `rgba(255, 220, 77, ${graphTransparency})`,
    memory: {
      buffers: `rgba(142, 56, 142, ${graphTransparency})`,
      cache: `rgba(205, 150, 205, ${graphTransparency})`,
      swap: `rgba(238, 44, 44, ${graphTransparency})`,
      used: `rgba(236, 200, 236, ${graphTransparency})`,
    },
    network: {
      inbound: `rgba(16, 162, 29, ${graphTransparency})`,
      outbound: `rgba(49, 206, 62, ${graphTransparency})`,
    },
    orange: `rgba(255, 179, 77, ${graphTransparency})`,
    processCount: `rgba(113, 86, 245, ${graphTransparency})`,
    purple: `rgba(217, 176, 217, ${graphTransparency})`,
    queries: {
      delete: `rgba(2, 54, 59, ${graphTransparency})`,
      insert: `rgba(26, 151, 162, ${graphTransparency})`,
      select: `rgba(34, 192, 206, ${graphTransparency})`,
      update: `rgba(19, 110, 118, ${graphTransparency})`,
    },
    ram: `rgba(224, 131, 224, ${graphTransparency})`,
    red: `rgba(255, 99, 60, ${graphTransparency})`,
    requests: `rgba(34, 206, 182, ${graphTransparency})`,
    slowQueries: `rgba(255, 61, 61, ${graphTransparency})`,
    space: `rgba(255, 99, 61, ${graphTransparency})`,
    workers: {
      DNSLookup: `rgba(143, 133, 218, ${graphTransparency})`,
      cleanup: `rgba(152, 97, 189, ${graphTransparency})`,
      closing: `rgba(145, 124, 211, ${graphTransparency})`,
      finishing: `rgba(149, 106, 196, ${graphTransparency})`,
      keepAlive: `rgba(141, 143, 225, ${graphTransparency})`,
      logging: `rgba(147, 115, 203, ${graphTransparency})`,
      reading: `rgba(137, 161, 240, ${graphTransparency})`,
      sending: `rgba(139, 152, 233, ${graphTransparency})`,
      starting: `rgba(135, 170, 247, ${graphTransparency})`,
      waiting: `rgba(133, 180, 255, ${graphTransparency})`,
      writing: `rgba(32, 131, 75, ${graphTransparency})`,
    },
    yellow: `rgba(255, 220, 125, ${graphTransparency})`,
  },
  name: 'light', // @todo remove this because we leverage pallete.mode now
  palette: {
    background: {
      default: bg.app,
    },
    divider: primaryColors.divider,
    error: {
      dark: color.red,
      light: color.red,
      main: color.red,
    },
    info: {
      dark: '#3682dd',
      light: '#d7e3ef',
      main: '#d7e3ef',
    },
    mode: 'light',
    primary: primaryColors,
    secondary: primaryColors,
    success: {
      dark: '#00b159',
      light: '#00b159',
      main: '#00b159',
    },
    text: {
      primary: primaryColors.text,
    },
    warning: {
      dark: '#ffd002',
      light: '#fdf4da',
      main: '#fdf4da',
    },
  },
  shadows: [
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
  ],
  spacing,
  textColors,
  typography: {
    body1: {
      color: primaryColors.text,
      fontSize: '0.875rem',
      lineHeight: '1.125rem',
    },
    caption: {
      color: primaryColors.text,
      fontSize: '0.625rem',
      lineHeight: '0.625rem',
    },
    fontFamily: latoWeb.normal,
    fontSize: 16,
    h1: {
      [breakpoints.up('lg')]: {
        fontSize: '1.5rem',
        lineHeight: '1.875rem',
      },
      color: primaryColors.headline,
      fontFamily: latoWeb.bold,
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
    },
    h2: {
      color: primaryColors.headline,
      fontFamily: latoWeb.bold,
      fontSize: '1.125rem',
      lineHeight: '1.5rem',
    },
    h3: {
      color: primaryColors.headline,
      fontFamily: latoWeb.bold,
      fontSize: '1rem',
      lineHeight: '1.4rem',
    },
    subtitle1: {
      color: primaryColors.text,
      fontSize: '1.075rem',
      lineHeight: '1.5rem',
    },
  },
  visually: {
    hidden: visuallyHidden,
    visible: visuallyVisible,
  },
};

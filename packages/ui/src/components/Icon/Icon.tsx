import { styled, useThemeProps } from '@mui/material/styles';
import * as React from 'react';

import * as Icons from '../../assets/iconsV2';

import type { SxProps, Theme } from '@mui/material/styles';

type IconSize = 12 | 16 | 20 | 24;
type IconState = 'filled' | 'outlined';
type IconDirection = 'down' | 'left' | 'right' | 'up';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type IconFamilyName =
  | 'IconArrow'
  | 'IconCaret'
  | 'IconChevron'
  | 'IconFlag'
  | 'IconHelpCircle'
  | 'IconInfo'
  | 'IconPin'
  | 'IconSecurityAlert'
  | 'IconStar'
  | 'IconStatusAlert'
  | 'IconStatusDenied'
  | 'IconStatusFailure'
  | 'IconStatusSuccess'
  | 'IconTag';

export type IconName = IconFamilyName | RealIconName;

type IconsModule = typeof Icons;
type RealIconName = keyof IconsModule;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string; // CSS color or token (e.g., var(--color-text))
  direction?: IconDirection; // required for family: arrow, caret, chevron
  name: IconName; // real icon name or family alias
  size?: IconSize; // px applied in code; default 20
  state?: IconState; // required for family: caret, flag/star/... groups
  sx?: SxProps<Theme>; // MUI system styles
}

const arrowByDirection: Record<IconDirection, RealIconName> = {
  up: 'IconArrowUp',
  right: 'IconArrowRight',
  down: 'IconArrowDown',
  left: 'IconArrowLeft',
};

// Families that support 'filled' | 'outlined' state without direction variants.
// - Excludes 'IconArrow' and 'IconChevron' (direction-only, no state)
// - Excludes 'IconCaret' (handled separately via direction + state in `caretByState`)
const statefulByFamily: Record<
  Exclude<IconFamilyName, 'IconArrow' | 'IconCaret' | 'IconChevron'>,
  Record<IconState, RealIconName>
> = {
  IconFlag: { filled: 'IconFlagFilled', outlined: 'IconFlagOutline' },
  IconHelpCircle: {
    filled: 'IconHelpCircleFilled',
    outlined: 'IconHelpCircleOutline',
  },
  IconInfo: { filled: 'IconInfoFilled', outlined: 'IconInfoOutline' },
  IconPin: { filled: 'IconPinFilled', outlined: 'IconPinOutline' },
  IconSecurityAlert: {
    filled: 'IconSecurityAlertFilled',
    outlined: 'IconSecurityAlertOutline',
  },
  IconStar: { filled: 'IconStarFilled', outlined: 'IconStarOutline' },
  IconStatusAlert: {
    filled: 'IconStatusAlertFilled',
    outlined: 'IconStatusAlertOutline',
  },
  IconStatusDenied: {
    filled: 'IconStatusDeniedSolid',
    outlined: 'IconStatusDeniedOutline',
  },
  IconStatusFailure: {
    filled: 'IconStatusFailureFilled',
    outlined: 'IconStatusFailureOutline',
  },
  IconStatusSuccess: {
    filled: 'IconStatusSuccessFilled',
    outlined: 'IconStatusSuccessOutline',
  },
  IconTag: { filled: 'IconTagFilled', outlined: 'IconTagOutline' },
};

const chevronByDirection: Record<IconDirection, RealIconName> = {
  up: 'IconChevronUp',
  right: 'IconChevronRight',
  down: 'IconChevronDown',
  left: 'IconChevronLeft',
};

const caretByState: Record<IconState, Record<IconDirection, RealIconName>> = {
  filled: {
    up: 'IconCaretUpFilled',
    right: 'IconCaretRightFilled',
    down: 'IconCaretDownFilled',
    left: 'IconCaretLeftFilled',
  },
  outlined: {
    up: 'IconCaretUpOutline',
    right: 'IconCaretRightOutline',
    down: 'IconCaretDownOutline',
    left: 'IconCaretLeftOutline',
  },
};

function isFamilyName(name: IconName): name is IconFamilyName {
  return (
    name === 'IconArrow' ||
    name === 'IconCaret' ||
    name === 'IconChevron' ||
    name === 'IconFlag' ||
    name === 'IconHelpCircle' ||
    name === 'IconInfo' ||
    name === 'IconPin' ||
    name === 'IconSecurityAlert' ||
    name === 'IconStar' ||
    name === 'IconStatusAlert' ||
    name === 'IconStatusDenied' ||
    name === 'IconStatusFailure' ||
    name === 'IconStatusSuccess' ||
    name === 'IconTag'
  );
}

/**
 * Ensures the correct supporting props are present for family aliases.
 * - Direction is required for 'IconArrow' and 'IconChevron'.
 * - Both direction and state are required for 'IconCaret'.
 * - State is required for other stateful families (e.g., Flag, Star, Tag, etc.).
 * Real icon names (concrete exports) bypass these checks.
 */
function enforceRequirements(
  name: IconName,
  direction: IconDirection | undefined,
  state: IconState | undefined,
) {
  if (!isFamilyName(name)) return;
  if (name === 'IconArrow' || name === 'IconChevron') {
    if (!direction) {
      throw new Error(
        `${name} requires a direction prop (up | right | down | left).`,
      );
    }
  }
  if (name === 'IconCaret') {
    if (!direction) {
      throw new Error(
        `IconCaret requires a direction prop (up | right | down | left).`,
      );
    }
    if (!state) {
      throw new Error(
        `IconCaret requires a state prop ('outlined' | 'filled').`,
      );
    }
  }
  const requiresState: Array<IconName> = [
    'IconFlag',
    'IconHelpCircle',
    'IconInfo',
    'IconTag',
    'IconStar',
    'IconSecurityAlert',
    'IconStatusAlert',
    'IconStatusDenied',
    'IconStatusFailure',
    'IconStatusSuccess',
    'IconPin',
  ];
  if (requiresState.includes(name) && !state) {
    throw new Error(`${name} requires a state prop ('outlined' | 'filled').`);
  }
}

/**
 * Resolves the actual icon component to render from either a family alias or a concrete export name.
 * - Family aliases route to specific concrete exports based on direction/state.
 * - Concrete export names are looked up directly from the icons module.
 * Throws with a helpful message when required props are missing or when a name is unknown.
 */
function resolveComponent(
  name: IconName,
  direction: IconDirection | undefined,
  state: IconState | undefined,
): IconComponent {
  if (isFamilyName(name)) {
    if (name === 'IconArrow') {
      if (!direction) throw new Error('IconArrow requires direction.');
      return Icons[arrowByDirection[direction]] as IconComponent;
    }
    if (name === 'IconChevron') {
      if (!direction) throw new Error('IconChevron requires direction.');
      return Icons[chevronByDirection[direction]] as IconComponent;
    }
    if (name === 'IconCaret') {
      if (!direction || !state) {
        throw new Error('IconCaret requires direction and state.');
      }
      return Icons[caretByState[state][direction]] as IconComponent;
    }
    if (name in statefulByFamily) {
      if (!state) throw new Error(`${name} requires state.`);
      const compName =
        statefulByFamily[name as keyof typeof statefulByFamily][state];
      return Icons[compName] as IconComponent;
    }
  }
  const Real = Icons[name as RealIconName] as IconComponent | undefined;
  if (!Real) {
    throw new Error(
      `Unknown icon name: ${String(
        name,
      )}. Use a valid icon export or a supported family alias.`,
    );
  }
  return Real;
}

/**
 * Icon component
 * Accepts either a concrete icon export name (e.g., 'IconClose') or a family alias
 * (e.g., 'IconArrow', 'IconCaret', 'IconChevron', ...). For families, provide
 * the required disambiguating props (direction/state). Applies size (px) and color.
 */
export const Icon = (inProps: IconProps) => {
  const {
    name,
    size = 20,
    state,
    direction,
    color,
    sx,
    ...svgProps
  } = useThemeProps({ props: inProps, name: 'MuiLinodeIcon' });

  enforceRequirements(name, direction, state);
  const Comp = resolveComponent(name, direction, state);

  const pixel = `${size}px`;
  const computedSx: SxProps<Theme> = [
    { width: pixel, height: pixel, ...(color ? { color } : {}) },
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ];

  return (
    <IconRoot
      as={Comp}
      height={pixel}
      sx={computedSx}
      width={pixel}
      {...svgProps}
    />
  );
};

export const IconRoot = styled('svg', {
  name: 'MuiLinodeIcon',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'inline-block',
  flex: '0 0 auto',
});

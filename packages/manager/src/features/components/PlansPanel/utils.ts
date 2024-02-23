import { arrayToList } from 'src/utilities/arrayToList';
import { ExtendedType } from 'src/utilities/extendType';

import {
  DBAAS_DEDICATED_512_GB_PLAN,
  DEDICATED_512_GB_PLAN,
  PREMIUM_512_GB_PLAN,
} from './constants';
import { PlanSelectionType } from './types';

import type {
  Capabilities,
  LinodeTypeClass,
  Region,
  RegionAvailability,
} from '@linode/api-v4';

export type PlansTypes<T> = Record<LinodeTypeClass, T[]>;

type PlansByType<T> = Omit<PlansTypes<T>, 'nanode' | 'standard'> & {
  shared: T[];
};

// We could update this to add or remove any new or existing plan tabs.
export const planTypeOrder: (
  | 'shared'
  | Exclude<LinodeTypeClass, 'nanode' | 'standard'>
)[] = [
  'prodedicated',
  'dedicated',
  'shared',
  'highmem',
  'gpu',
  'metal',
  'premium',
];

/**
 * getPlanSelectionsByPlanType function takes an array of types, groups
 * them based on their class property into different plan types, filters out empty
 * plan types, and returns an object containing the filtered plan selections.
 * getPlanSelectionsByPlanType is common util funtion used to provide plans by
 * type to Linode, Database and LKE plan tables.
 * The planTypeOrder array specifies the order in which the Linode types should be processed.
 * Any change to the order can result in incorrect rendering of plan tabs.
 */

export const getPlanSelectionsByPlanType = <
  T extends { class: LinodeTypeClass }
>(
  types: T[]
): PlansByType<T> => {
  const plansByType: PlansByType<T> = planTypeOrder.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as PlansByType<T>);

  // group plans by type
  for (const type of types) {
    switch (type.class) {
      case 'nanode':
      case 'standard':
        plansByType['shared'].push(type);
        break;
      default:
        if (plansByType.hasOwnProperty(type.class)) {
          plansByType[type.class].push(type);
        }
        break;
    }
  }

  // filter empty plan group
  return Object.keys(plansByType).reduce((acc, key) => {
    if (plansByType[key].length > 0) {
      acc[key] = plansByType[key];
    }
    return acc;
  }, {} as PlansByType<T>);
};

export const determineInitialPlanCategoryTab = <T>(
  types: (ExtendedType | PlanSelectionType)[],
  selectedId?: string,
  currentPlanHeading?: string
) => {
  const plans = getPlanSelectionsByPlanType(types);

  const tabOrder: LinodeTypeClass[] = Object.keys(plans).map((plan) =>
    plan === 'shared' ? 'standard' : (plan as LinodeTypeClass)
  );

  // Determine initial plan category tab based on current plan selection
  // (if there is one).
  const _selectedTypeClass =
    types.find(
      (type) => type.id === selectedId || type.heading === currentPlanHeading
    )?.class ?? 'dedicated';

  // We don't have a "Nanodes" tab anymore, so use `standard` (labeled as "Shared CPU").
  const selectedTypeClass =
    _selectedTypeClass === 'nanode' ? 'standard' : _selectedTypeClass;

  return tabOrder.indexOf(selectedTypeClass);
};

export const getRegionsWithCapability = (
  capability: Capabilities,
  regions: Region[]
) => {
  const withCapability = regions
    ?.filter((thisRegion: Region) =>
      thisRegion.capabilities.includes(capability)
    )
    .map((thisRegion: Region) => thisRegion.label);
  return arrayToList(withCapability ?? []);
};

interface PlanSoldOutStatusOptions {
  plan: PlanSelectionType;
  regionAvailabilities: RegionAvailability[] | undefined;
  selectedRegionId: Region['id'] | undefined;
}

/**
 * Utility to determine if a plan is sold out based on a region's availability.
 */
export const getIsPlanSoldOut = ({
  plan,
  regionAvailabilities,
  selectedRegionId,
}: PlanSoldOutStatusOptions): boolean => {
  if (!regionAvailabilities || !selectedRegionId) {
    return false;
  }

  const availability = regionAvailabilities?.find((regionAvailability) => {
    const regionMatch = regionAvailability?.region === selectedRegionId;

    if (!regionMatch) {
      return false;
    }

    if (regionAvailability.plan === plan.id) {
      return regionAvailability.available === false;
    }

    return false;
  });

  return !!availability;
};

export const planTabInfoContent = {
  dedicated: {
    dataId: 'data-qa-dedicated',
    key: 'dedicated',
    title: 'Dedicated CPU',
    typography:
      'Dedicated CPU instances are good for full-duty workloads where consistent performance is important.',
  },
  gpu: {
    dataId: 'data-qa-gpu',
    key: 'gpu',
    title: 'GPU',
    typography:
      'Linodes with dedicated GPUs accelerate highly specialized applications such as machine learning, AI, and video transcoding.',
  },
  highmem: {
    dataId: 'data-qa-highmem',
    key: 'highmem',
    title: 'High Memory',
    typography:
      'High Memory instances favor RAM over other resources, and can be good for memory hungry use cases like caching and in-memory databases. All High Memory plans use dedicated CPU cores.',
  },
  metal: {
    dataId: 'data-qa-metal',
    key: 'metal',
    title: 'Bare Metal',
    typography:
      'Bare Metal Linodes give you full, dedicated access to a single physical machine. Some services, including backups, VLANs, and disk management, are not available with these plans.',
  },
  premium: {
    dataId: 'data-qa-premium',
    key: 'premium',
    title: 'Premium CPU',
    typography:
      'Premium CPU instances guarantee a minimum processor generation of AMD EPYC\u2122 Milan or newer to ensure consistent high performance for more demanding workloads.',
  },
  prodedicated: {
    dataId: 'data-qa-prodedi',
    key: 'prodedicated',
    title: 'Pro Dedicated CPU',
    typography:
      'Pro Dedicated CPU instances are for very demanding workloads. They only have AMD 2nd generation processors or newer.',
  },
  shared: {
    dataId: 'data-qa-standard',
    key: 'shared',
    title: 'Shared CPU',
    typography:
      'Shared CPU instances are good for medium-duty workloads and are a good mix of performance, resources, and price.',
  },
};

export const replaceOrAppend512GbPlans = (
  types: ExtendedType[] | PlanSelectionType[]
) => {
  const isInDatabasesFlow = types.some((type) => type.label.includes('DBaaS'));

  // For Linodes and LKE
  const dedicated512GbIndex = types.findIndex(
    (type) => type.label === 'Dedicated 512GB'
  );

  const premium512GbIndex = types.findIndex(
    (type) => type.label === 'Premium 512GB'
  );

  // For DBaaS
  const dbaasDedicated512GbIndex = types.findIndex(
    (type) => type.label === 'DBaaS - Dedicated 512GB'
  );

  if (isInDatabasesFlow) {
    if (dbaasDedicated512GbIndex !== -1) {
      types[dbaasDedicated512GbIndex] = DBAAS_DEDICATED_512_GB_PLAN;
    } else {
      types.push(DBAAS_DEDICATED_512_GB_PLAN);
    }

    return types;
  }

  /*
    If the Dedicated 512 GB plan is present in the response, overwrite it.
    If it isn't, insert a placeholder at the end of the array.
  */
  if (dedicated512GbIndex !== -1) {
    types[dedicated512GbIndex] = DEDICATED_512_GB_PLAN;
  } else {
    types.push(DEDICATED_512_GB_PLAN);
  }

  if (premium512GbIndex !== -1) {
    types[premium512GbIndex] = PREMIUM_512_GB_PLAN;
  } else {
    types.push(PREMIUM_512_GB_PLAN);
  }

  return types;
};

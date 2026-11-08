import React from 'react';
import { usePreferences } from '../../contexts/preferences';
import type { DayStatus } from '../../types';
import { STATUS_STYLES } from './statusStyles';

const StatusBadge: React.FC<{ status: DayStatus }> = ({ status }) => {
  const { t } = usePreferences();
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {t(`status.${status}`)}
    </span>
  );
};

export default StatusBadge;

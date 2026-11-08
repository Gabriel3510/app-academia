import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { getExerciseFile } from '../../utils/training';

interface ExerciseImageProps {
  name: string;
  className?: string;
  eager?: boolean;
}

const ExerciseImage: React.FC<ExerciseImageProps> = ({ name, className = '', eager }) => {
  const { t, exerciseName } = usePreferences();
  const file = getExerciseFile(name);
  const [failedFile, setFailedFile] = useState<string | null>(null);

  if (!file || failedFile === file) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 bg-surface-2 text-subtle text-[11px] text-center p-1 ${className}`}>
        <ImageOff size={20} />
        <span>{t('plan.gifMissing')}</span>
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}gifs/${file}`}
      alt={exerciseName(name)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedFile(file)}
      // GIFs have white backgrounds, so they stay on white in dark mode too
      className={`bg-white object-contain ${className}`}
    />
  );
};

export default ExerciseImage;

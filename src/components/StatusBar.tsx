import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  dark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = () => {
  // Real mobile devices already have native OS status bars; do not render a fake one inside the app
  return null;
};

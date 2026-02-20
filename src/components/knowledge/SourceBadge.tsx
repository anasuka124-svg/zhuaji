'use client';

import { SOURCE_TYPES, SourceType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, Users, User } from 'lucide-react';

const SOURCE_ICONS = {
  official: CheckCircle,
  expert: Award,
  community: Users,
  user: User,
};

interface SourceBadgeProps {
  type: SourceType;
  showIcon?: boolean;
}

export function SourceBadge({ type, showIcon = true }: SourceBadgeProps) {
  const source = SOURCE_TYPES[type];
  const Icon = SOURCE_ICONS[type];

  return (
    <Badge className={`text-xs ${source.color} gap-1`}>
      {showIcon && <Icon className="h-3 w-3" />}
      {source.label}
    </Badge>
  );
}

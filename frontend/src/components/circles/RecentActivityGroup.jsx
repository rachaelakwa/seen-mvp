import React from 'react';
import CircleAvatar from './CircleAvatar';
import RecentActivityItem from './RecentActivityItem';
import { getTitleById, getRelativeTime } from '../../utils/circlesLogic';
import './circles.css';

export default function RecentActivityGroup({ friendGroup, onSave }) {
  const { friend, items } = friendGroup;

  if (!friend || items.length === 0) return null;

  return (
    <div className="recent-activity-group">
      <div className="recent-activity-group-header">
        <CircleAvatar friend={friend} size="40px" />
        <h3 className="recent-activity-group-header-title">
          {friend.name}'s recent
        </h3>
      </div>

      <div>
        {items.map(item => {
          const title = getTitleById(item.titleId);
          const relativeTime = getRelativeTime(item.occurredAt);

          return (
            <RecentActivityItem
              key={item.id}
              item={item}
              friend={friend}
              title={title}
              onSave={onSave}
              relativeTime={relativeTime}
            />
          );
        })}
      </div>
    </div>
  );
}

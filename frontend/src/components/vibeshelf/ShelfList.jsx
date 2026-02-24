import React from 'react';
import ShelfItemCard from './ShelfItemCard';
import './vibeshelf.css';

export default function ShelfList({ items = [], onRemove }) {
  if (items.length === 0) {
    return (
      <div className="shelf-list">
        <p>No saves yet. Love a pick from the Mood page to add it here.</p>
      </div>
    );
  }

  return (
    <div className="shelf-list">
      {items.map(item => (
        <ShelfItemCard key={item.id} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
}

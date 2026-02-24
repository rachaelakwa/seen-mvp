import React from 'react';
import './vibeshelf.css';

export default function ShelfItemCard({ item, onRemove }) {
  return (
    <div className="shelf-item-card">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="shelf-item-card-image"
        />
      )}
      <div className="shelf-item-card-body">
        <div className="shelf-item-card-header">
          <div>
            <h4 className="shelf-item-card-title">
              {item.title}
            </h4>
            <p className="shelf-item-card-note">
              {item.note}
            </p>
          </div>
          <span className="shelf-item-card-mood">
            {item.mood}
          </span>
        </div>
        {onRemove && (
          <button
            className="shelf-item-card-remove-btn"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

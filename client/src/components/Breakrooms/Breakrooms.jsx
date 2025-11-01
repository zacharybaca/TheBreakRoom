import { Link } from 'react-router-dom';
import './breakrooms.css';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import { useModal } from '../../hooks/useModal.js';

/**
 * BreakroomBoard
 * - permanent themed breakrooms displayed as "pinned" cards on a bulletin board
 * - props.rooms: optional array to override sampleRooms
 */

const sampleRooms = [
  {
    id: 'coffee',
    name: 'Coffee Chat',
    vibe: 'Casual chit-chat & memes',
    accent: '#8B5E3C', // coffee brown
    occupants: 12,
    newCount: 3,
    icon: '☕',
  },
  {
    id: 'watercooler',
    name: 'Water Cooler',
    vibe: 'Quick office banter',
    accent: '#2B9AF3', // light blue
    occupants: 5,
    newCount: 0,
    icon: '🗨️',
  },
  {
    id: 'deepwork',
    name: 'Deep Work',
    vibe: 'Focused heads-down sessions',
    accent: '#3A7D44', // green
    occupants: 8,
    newCount: 1,
    icon: '🎧',
  },
  {
    id: 'vent',
    name: 'Vent & Rant Zone',
    vibe: 'Unburden, get support',
    accent: '#C14B5A', // muted red
    occupants: 4,
    newCount: 2,
    icon: '💬',
  },
];

const Breakrooms = ({ rooms = sampleRooms, onJoin }) => {
  const { onOpen } = useModal();

  return (
    <>
      <ReusableStyledButton
        title="Create New Breakroom"
        type="button"
        onClick={() => onOpen('breakrooms/create')}
      />
      <br />
      <section className="board-wrap" aria-label="Breakroom directory">
        <h2 className="board-title">Breakrooms</h2>

        <div className="board">
          {rooms.map((r) => (
            <>
            <hr />
            <article
              key={r.id}
              className="pin-card"
              style={{ '--accent': r.accent }}
              role="button"
              tabIndex={0}
              onClick={() => onJoin?.(r)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onJoin?.(r);
              }}
              aria-describedby={`${r.id}-meta`}
            >
              <div className="pin-top">
                <span className="pushpin" aria-hidden="true">
                  📌
                </span>
              </div>

              <div className="join-room-button-container">
                <button
                  type="button"
                  id="join-room-button"
                >
                  Join Room
                </button>
              </div>

              <div className="pin-body">
                <div className="pin-icon" aria-hidden="true">
                  {r.icon}
                </div>

                <div className="pin-text">
                  <h3 className="pin-title">{r.name}</h3>
                  <p className="pin-vibe">{r.vibe}</p>
                </div>

                <div className="pin-meta" id={`${r.id}-meta`}>
                  <span className="occupants">{r.occupants} in</span>
                  {r.newCount > 0 && (
                    <span className="new-badge" aria-live="polite">
                      +{r.newCount}
                    </span>
                  )}
                </div>
              </div>
            </article>
            </>
          ))}
        </div>
      </section>
    </>
  );
};

export default Breakrooms;

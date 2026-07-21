import React from 'react';
import { continentalManualHTML } from '../../constants/game';

export function RulesModal({ speechStatus, speakText, pauseSpeech, resumeSpeech, cancelSpeech, onClose }) {
  const handleClose = () => {
    cancelSpeech();
    onClose();
  };

  return (
    <div className="cc-overlay show">
      <div className="cc-modal">
        <div className="cc-modal-header">
          <div className="cc-modal-title">
            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 4 }}>
              menu_book
            </span>
            Manual del Continental
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {speechStatus === 'idle' && (
              <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={() => speakText(continentalManualHTML)}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>volume_up</span>
              </button>
            )}
            {speechStatus === 'speaking' && (
              <>
                <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={pauseSpeech}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>pause</span>
                </button>
                <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={cancelSpeech}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>stop</span>
                </button>
              </>
            )}
            {speechStatus === 'paused' && (
              <>
                <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={resumeSpeech}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>play_arrow</span>
                </button>
                <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={cancelSpeech}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>stop</span>
                </button>
              </>
            )}
            <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={handleClose}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
            </button>
          </div>
        </div>
        <div className="cc-rules-content" dangerouslySetInnerHTML={{ __html: continentalManualHTML }} />
      </div>
    </div>
  );
}

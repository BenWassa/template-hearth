import React, { useState } from 'react';
import { Clock, Film, MessageSquare, Tv } from 'lucide-react';
import { ENERGIES, VIBES } from '../config/constants.js';
import Button from '../components/ui/Button.js';
import Input from '../components/ui/Input.js';
import TextArea from '../components/ui/TextArea.js';

const AddView = ({ onBack, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [vibe, setVibe] = useState(VIBES[0].id);
  const [energy, setEnergy] = useState('balanced');
  const [runtimeMinutes, setRuntimeMinutes] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      type,
      vibe,
      energy,
      note: note.trim(),
    };
    if (type === 'movie') {
      const parsedRuntime = Number.parseInt(runtimeMinutes, 10);
      if (Number.isFinite(parsedRuntime) && parsedRuntime > 0) {
        payload.runtimeMinutes = parsedRuntime;
      }
    }
    onSubmit(payload);
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-950 animate-in slide-in-from-bottom duration-300 w-full">
      <div className="p-6 flex items-center justify-between border-b border-stone-900">
        <button
          onClick={onBack}
          className="text-stone-400 hover:text-stone-200 text-sm font-medium"
        >
          Cancel
        </button>
        <span className="font-serif text-stone-200">Save for Us</span>
        <div className="w-12" /> {/* Spacer */}
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        {/* Title Input */}
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Movie or Show Title..."
            autoFocus
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-stone-400">
            Type
          </div>
          <div className="flex gap-2">
            {['movie', 'show'].map((t) => {
              const isSelected = type === t;
              const TypeIcon = t === 'movie' ? Film : Tv;
              return (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    if (t === 'show') setRuntimeMinutes('');
                  }}
                  className={`flex-1 py-2 rounded-lg border text-xs uppercase tracking-widest transition-all ${
                    isSelected
                      ? 'bg-stone-800 border-stone-700 text-stone-200'
                      : 'border-stone-800 text-stone-400 hover:bg-stone-900'
                  }`}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <TypeIcon className="w-3.5 h-3.5" />
                    {t}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vibe */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-stone-400">
            Vibe
          </div>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => {
              const isSelected = vibe === v.id;
              const VibeIcon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => setVibe(v.id)}
                  className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-widest transition-all ${
                    isSelected
                      ? 'bg-stone-800 border-stone-700 text-stone-200'
                      : 'border-stone-800 text-stone-500 hover:bg-stone-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <VibeIcon className="w-3.5 h-3.5" />
                    {v.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-stone-400">
            Energy
          </div>
          <div className="flex flex-wrap gap-2">
            {ENERGIES.map((e) => {
              const isSelected = energy === e.id;
              const EnergyIcon = e.icon;
              return (
                <button
                  key={e.id}
                  onClick={() => setEnergy(e.id)}
                  className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-widest transition-all ${
                    isSelected
                      ? 'bg-stone-800 border-stone-700 text-stone-200'
                      : 'border-stone-800 text-stone-500 hover:bg-stone-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <EnergyIcon className="w-3.5 h-3.5" />
                    {e.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Runtime */}
        {type === 'movie' && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
              <Clock className="w-3 h-3" />
              Runtime{' '}
              <span className="text-stone-700 font-normal normal-case">
                (Minutes, optional)
              </span>
            </label>
            <Input
              value={runtimeMinutes}
              onChange={(e) => setRuntimeMinutes(e.target.value)}
              placeholder="e.g. 97"
              type="number"
              min="1"
              inputMode="numeric"
            />
          </div>
        )}

        {/* Note */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
            <MessageSquare className="w-3 h-3" />
            Why this?{' '}
            <span className="text-stone-700 font-normal normal-case">
              (Optional)
            </span>
          </label>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Heard it's funny, Good for a rainy day..."
          />
        </div>
      </div>

      <div className="p-6 border-t border-stone-900 bg-stone-950/95 backdrop-blur">
        <Button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-full"
        >
          Put on Shelf
        </Button>
      </div>
    </div>
  );
};

export default AddView;

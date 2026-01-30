# Bottom Nav (ShelfView)

```jsx
      {/* Bottom Nav */}
      <div
        className="mt-auto sticky bottom-0 z-40 w-full border-t border-stone-900 bg-gradient-to-b from-stone-950/0 to-stone-950"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {selectionMode && (
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-stone-400">
              {selectedCount} selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={toggleSelectionMode}
                className="text-sm text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedCount === 0 || isBulkDeleting}
                className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 disabled:opacity-50 transition-colors"
              >
                {isBulkDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav - Tonight, Add & Library */}
      <nav
        className="fixed left-1/2 -translate-x-1/2 bottom-6 z-40 max-w-md w-[calc(100%-3rem)]"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="bg-stone-900/80 backdrop-blur-2xl border border-stone-700/50 rounded-3xl shadow-2xl shadow-black/40 p-2">
          <div className="flex items-center justify-around gap-2">
            {/* Add Button */}
            <button
              onClick={onAdd}
              className="group flex-1 py-3 px-4 flex flex-col items-center gap-1.5 rounded-2xl hover:bg-white/5 transition-all duration-300 active:scale-95"
              title="Add new item"
            >
              <Plus className="w-6 h-6 text-stone-300 group-hover:text-amber-300 transition-colors" />
              <span className="text-xs font-bold tracking-wide text-stone-400 group-hover:text-stone-200 transition-colors">
                Add
              </span>
            </button>

            {/* Tonight Button */}
            <button
              onClick={onBack}
              className="group flex-1 py-3 px-4 flex flex-col items-center gap-1.5 rounded-2xl hover:bg-white/5 transition-all duration-300 active:scale-95"
              title="Back to Tonight"
            >
              <Moon className="w-6 h-6 text-stone-300 group-hover:text-amber-300 transition-colors" />
              <span className="text-xs font-bold tracking-wide text-stone-400 group-hover:text-stone-200 transition-colors">
                Tonight
              </span>
            </button>

            {/* Library Button - Current Page (inactive) */}
            <button
              disabled
              className="group flex-1 py-3 px-4 flex flex-col items-center gap-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 cursor-default"
              title="Library"
            >
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-bold tracking-wide text-amber-300">
                Library
              </span>
            </button>
          </div>
        </div>
      </nav>
```

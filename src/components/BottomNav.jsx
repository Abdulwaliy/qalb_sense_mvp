export default function BottomNav() {
  const tabs = [
    { icon: '🏠', label: 'Dashboard' },
    { icon: '📊', label: 'Insights' },
    { icon: '🧭', label: 'Journey' },
    { icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {tabs.map((tab, i) => (
        <button key={i} className="flex flex-col items-center text-sm">
          <span className="text-xl">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

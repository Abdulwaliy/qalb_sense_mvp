export default function FeatureButton({ icon, label }) {
  return (
    <div className="flex flex-col items-center w-1/4">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-sm">{label}</p>
    </div>
  );
}

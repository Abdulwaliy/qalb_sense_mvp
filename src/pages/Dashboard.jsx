import MoodSelector from '../components/MoodSelector';
import PathCard from '../components/PathCard';
import ReflectionCard from '../components/ReflectionCard';
import FeatureButton from '../components/FeatureButton';
import BottomNav from '../components/BottomNav';

export default function Dashboard() {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">NafsCompass</h1>

      <MoodSelector />
      <PathCard />
      <ReflectionCard />

      <div className="flex justify-between mt-4">
        <FeatureButton icon="📝" label="Journal" />
        <FeatureButton icon="📈" label="Progress" />
        <FeatureButton icon="🎯" label="Daily Challenge" />
        <FeatureButton icon="🕋" label="Spiritual Check-In" />
      </div>

      <BottomNav />
    </div>
  );
}

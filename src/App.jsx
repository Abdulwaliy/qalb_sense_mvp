import Dashboard from './pages/Dashboard';
import OldDemo from './pages/OldDemo';

function App() {
  const useOldDemo = true; // Change to true to view your old version

  return useOldDemo ? <OldDemo /> : <Dashboard />;
}

export default App;

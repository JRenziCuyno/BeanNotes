import Dashboard from './Dashboard';
import DonateButton from './components/DonateButton'; // Ensure typo is fixed here

function App() {
  return (
    <div className="relative">
      <Dashboard />
        <div className="fixed bottom-6 right-6 z-50">
          <DonateButton />
        </div>
    </div>
  );
}

export default App;
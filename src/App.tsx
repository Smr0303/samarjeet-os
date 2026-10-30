import './App.css';
import Desktop from './components/os/Desktop';
import BootScreen from './components/os/BootScreen';

function App() {
    return (
        <div className="App" style={{ position: 'relative' }}>
            <Desktop />
            <BootScreen />
        </div>
    );
}

export default App;

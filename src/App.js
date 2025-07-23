// Example in App.js
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CalendarProvider } from './context/CalendarContext';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CalendarProvider>
          {/* Your Router would go here */}
          <CalendarPage /> 
          {/* Other pages/routes */}
        </CalendarProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
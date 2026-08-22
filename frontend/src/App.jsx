import AppRoutes from "./routes/AppRoutes";
import AuthInitializer from "./components/AuthInitializer";

function App() {
  return (
    <AuthInitializer>
      <AppRoutes />
    </AuthInitializer>
  );
}

export default App;
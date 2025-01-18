import SignupCounter from './components/SignUpCounter'

function App() {
  return (
    <div className="w-screen h-screen">
      <SignupCounter 
        goalCount={2}
        updateInterval={5000}
      />
    </div>
  )
}

export default App

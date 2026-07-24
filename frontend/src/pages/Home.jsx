import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Welcome to PrepHub AI</h1>
      <p>Your AI-powered interview preparation platform.</p>
      <Link to="/signup">Go to Signup</Link>
    </div>
  )
}

export default Home
import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="wrap py-28 text-center">
      <h1 className="text-5xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist or is not published.</p>
      <Link to="/" className="btn-brand mt-8">Back to home</Link>
    </div>
  )
}

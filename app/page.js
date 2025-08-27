import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EC Management System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to the Election Commission Management System
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/admin/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Admin Login
          </Link>
          
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            User Login
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>For administrative access, please use the Admin Login.</p>
          <p className="mt-2">Regular users can access their accounts via User Login.</p>
        </div>
      </div>
    </div>
  );
}

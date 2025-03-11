import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Map of route paths to human-readable names
  const routeNames = {
    'galerie': 'Card Gallery',
    'trade': 'Trade Details',
    'create-trade': 'Create Trade',
    'mytrades': 'My Trades',
    'login': 'Login',
    'register': 'Register',
    'notifications': 'Notifications',
    'friend-codes': 'Friend Codes'
  };
  
  return (
    <nav className="flex py-3 px-5 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </Link>
        </li>
        
        {pathnames.map((name, index) => {
          // For routes with IDs, handle special case
          const isLast = index === pathnames.length - 1;
          const isId = !isNaN(name) || (pathnames[index-1] === 'trade' && index === 1);
          
          // Build the route up to this point
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Get display name
          let displayName = routeNames[name] || name;
          if (isId && pathnames[index-1] === 'trade') {
            displayName = 'Trade #' + name;
          }
          
          return (
            <li key={index}>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                {!isLast ? (
                  <Link to={routeTo} className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                    {displayName}
                  </Link>
                ) : (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {displayName}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 
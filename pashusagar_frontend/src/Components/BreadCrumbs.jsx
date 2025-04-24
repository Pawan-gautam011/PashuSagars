import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight size={16} className="mx-2 text-gray-500" />
              )}
              
              {isLast ? (
                <span className="font-medium text-[#004D40]">{item.label}</span>
              ) : (
                <Link 
                  to={item.path} 
                  className="text-gray-700 hover:text-[#004D40] hover:underline font-medium"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
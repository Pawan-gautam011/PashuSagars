import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items }) => {
  Breadcrumbs.propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  return (
    <nav className="breadcrumbs px-4 sm:px-6 lg:px-20">
      <ol className="breadcrumb-items flex space-x-2 text-sm text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className={`breadcrumb-item ${
                isLast ? "font-semibold text-gray-500" : ""
              }`}
              aria-current={isLast ? "page" : undefined}
            >
              {isLast ? (
                item.label
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="text-white hover:text-green-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                  <span className="breadcrumb-separator mx-2 text-gray-200">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

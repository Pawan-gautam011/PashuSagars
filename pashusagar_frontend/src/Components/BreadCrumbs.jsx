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
    <nav className="breadcrumbs py-6">
      <ol className="breadcrumb-items text-primary flex">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className={`breadcrumb-item ${isLast ? "active" : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {isLast ? (
                item.label
              ) : (
                <>
                  <Link to={item.path}>{item.label}</Link>
                  <span className="breadcrumb-seperator"> &gt; </span>
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

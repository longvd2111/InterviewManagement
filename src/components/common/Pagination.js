import React from "react";
import "~/assets/css/Pagination.css";
import { Link } from "react-router-dom";

export default function Pagination({ currentPage, totalItems, onPageChange }) {
  return (
    <div className="pagination">
      <div>
        <p>{`${currentPage}/${totalItems} rows`}</p>
      </div>
      <div className="pagination-controls">
        <Link
          className={currentPage === 1 ? "pagination-disabled" : ""}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
           role="button"
          aria-label="Previous"
        >
          ❮
        </Link>

        <Link
          className={currentPage === totalItems ? "pagination-disabled" : ""}
          disabled={currentPage === totalItems}
          onClick={() => onPageChange(currentPage + 1)}
           role="button"
          aria-label="Next"
        >
          ❯
        </Link>
      </div>
    </div>
  );
}

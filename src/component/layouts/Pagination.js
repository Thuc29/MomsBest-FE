import { Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  let pagesToShow = pages;
  if (totalPages > 5) {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    pagesToShow = pages.slice(startPage - 1, endPage);

    // Add first page if not included
    if (!pagesToShow.includes(1)) {
      pagesToShow = [1, "...", ...pagesToShow.filter((p) => p !== 1)];
    }

    // Add last page if not included
    if (!pagesToShow.includes(totalPages)) {
      pagesToShow = [
        ...pagesToShow.filter((p) => p !== totalPages),
        "...",
        totalPages,
      ];
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {pagesToShow.map((page, index) =>
        typeof page === "string" ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 ${
              currentPage === page ? "bg-pink-500 hover:bg-pink-600" : ""
            }`}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="!h-8 !w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
};

export default Pagination;

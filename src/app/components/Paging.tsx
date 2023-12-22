import React, { useState, useEffect, useRef } from 'react';

interface PagingProps {
  disabled?: boolean;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Paging: React.FC<PagingProps> = ({ disabled, pageSize, currentPage, totalPages, onPageChange, onPageSizeChange }) => {
  const [pageSizeInput, setPageSizeInput] = useState(pageSize.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPageSizeInput(pageSize.toString());
    adjustInputWidth();
  }, [pageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePageSizeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSizeInput(event.target.value);
    adjustInputWidth();
  };

  const handlePageSizeChange = () => {
    const newSize = parseInt(pageSizeInput, 10);
    onPageSizeChange(newSize);
  };

  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <span
        key={i}
        role="button"
        style={disabled ? { cursor: 'not-allowed', pointerEvents: 'none' } : {}}
        onClick={() => handlePageChange(i)}
        className={`mr-2 px-4 py-2 rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
      >
        {i}
      </span>

    );
  }

  const adjustInputWidth = () => {
    if (inputRef.current) {
      inputRef.current.style.width = `${inputRef.current.value.length + 2}ch`;
    }
  };

  return (
    <div className="paging-container md:p-2 mt-2">
      <div className="pagination">
        {
          disabled ?
            <>
              <span style={{ marginRight: '8px', cursor: 'not-allowed', pointerEvents: 'none' }} className='' role="button" onClick={() => handlePageChange(currentPage - 1)}>frev</span>
              {pageButtons}
              <span role="button" style={{ cursor: 'not-allowed', pointerEvents: 'none' }} onClick={() => handlePageChange(currentPage + 1)}>next</span>
            </>
            :
            <>
              <span style={{ marginRight: '8px' }} className='' role="button" onClick={() => handlePageChange(currentPage - 1)}>frev</span>
              {pageButtons}
              <span role="button" onClick={() => handlePageChange(currentPage + 1)}>next</span>
            </>
        }
      </div>
      <div style={{ marginTop: '15px' }}>
        <span style={{ marginRight: '8px' }}>Page Size:</span>
        <input
          disabled={disabled}
          ref={inputRef}
          type="number"
          min={1}
          value={pageSizeInput}
          onChange={handlePageSizeInputChange}
          onBlur={adjustInputWidth}
          className='border-2 border-slate-300'
        />
        <button
          onClick={handlePageSizeChange}
          disabled={disabled}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${disabled ? '' : 'hover:bg-blue-700'}  ml-5 `}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Paging;
